import { JwtPayload } from 'jsonwebtoken';
import { TDSMMTask } from './dsmmtask.interface';
import { DSMMTask } from './dsmmtask.model';
import { User } from '../../User/user.model';
import mongoose, { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import { DSMMMultitasking } from '../DSMMMultitasking/dsmmmultitasking.model';
import QueryBuilder from '../../../builder/QueryBuilder';

const createDSMMTask = async (currentUser: JwtPayload, payLoad: TDSMMTask) => {
  const { email } = currentUser;
  const { selectedManpower = [], multiTask, multiTaskId } = payLoad;

  const currentUserDoc = await User.findOne({ email }).select('_id');
  if (!currentUserDoc?._id) {
    throw new AppError(httpStatus.NOT_FOUND, 'Current user not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create the DSMM task
    const [createdTask] = await DSMMTask.create(
      [
        {
          ...payLoad,
          createdBy: currentUserDoc._id,
        },
      ],
      { session },
    );

    if (!createdTask?._id) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create task',
      );
    }

    // If multiTask & multiTaskId, fetch its manpower list (once)
    let multitaskManpowerIds: string[] = [];
    if (multiTask && multiTaskId) {
      const multitaskDetails = await DSMMMultitasking.findById(multiTaskId)
        .select('manpower')
        .lean();
      if (!multitaskDetails) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid multiTaskId');
      }
      multitaskManpowerIds = multitaskDetails.manpower.map((id) =>
        id.toString(),
      );
    }

    // For each selectedManpower, validate & update
    for (const manpowerId of selectedManpower) {
      const manpower = await User.findById(manpowerId)
        .select('role firstName')
        .lean();

      if (!manpower) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `User with ID ${manpowerId} not found`,
        );
      }

      const isAdmin = manpower.role === 'dsmmAdmin';
      const isInMultitask = multitaskManpowerIds.includes(
        manpowerId.toString(),
      );

      if (!isAdmin && !isInMultitask) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `User ${manpower.firstName} is not part of DSMM or multitasking team.`,
        );
      }

      // Update user profile to add task if not already added
      await User.updateOne(
        {
          _id: manpowerId,
          'tasks.taskId': { $ne: createdTask._id },
        },
        {
          $push: {
            tasks: {
              taskId: createdTask._id,
              unit: 'DSMM',
              type: 'Task',
              category: 'DSMMTask',
            },
          },
        },
        { session },
      );
    }

    await session.commitTransaction();
    return createdTask;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to create DSMM task: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  } finally {
    session.endSession();
  }
};

// get all DSMM tasks
const getAllDSMMTasks = async (query: Record<string, unknown>) => {
  const baseQuery = DSMMTask.find();

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const tasks = await queryBuilder.modelQuery.lean();

  if (!tasks.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No DSMM tasks found');
  }
  return tasks;
};

const updateDSMMTask = async (id: string, payLoad: TDSMMTask) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await DSMMTask.findById(id).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    const { selectedManpower = [], multiTask, multiTaskId } = payLoad;

    // 🔷 Convert to Set for faster lookups
    const previousIds = new Set(
      task.selectedManpower.map((id) => id.toString()),
    );
    const currentIds = new Set(selectedManpower.map((id) => id.toString()));

    // 🔷 Compute removed manpower
    const removedIds = [...previousIds].filter((id) => !currentIds.has(id));

    if (removedIds.length > 0) {
      await User.updateMany(
        { _id: { $in: removedIds } },
        { $pull: { tasks: { taskId: id } } },
        { session },
      );
    }

    if (selectedManpower.length > 0) {
      const manpowerUsers = await User.find({ _id: { $in: selectedManpower } })
        .select('role firstName tasks')
        .lean()
        .session(session);

      if (manpowerUsers.length !== selectedManpower.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'One or more manpower users do not exist',
        );
      }

      // 🔷 If multiTask specified, get allowed manpower ids
      const allowedMultitaskIds = new Set<string>();
      if (multiTask && multiTaskId) {
        const multitask = await DSMMMultitasking.findById(multiTaskId)
          .select('manpower')
          .lean()
          .session(session);

        if (!multitask) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid multiTaskId provided',
          );
        }

        multitask.manpower.forEach((u) =>
          allowedMultitaskIds.add(u.userId.toString()),
        );
      }

      // 🔷 Validate roles + prepare list of users needing task add
      const usersToAddTask: Types.ObjectId[] = [];

      for (const user of manpowerUsers) {
        const isAdmin = user.role === 'dsmmAdmin';
        const isAllowed =
          isAdmin || allowedMultitaskIds.has(user._id.toString());

        if (!isAllowed) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `User ${user.firstName} must be part of DSMM or multitasking team`,
          );
        }

        const alreadyHasTask = user.tasks?.some(
          (t) => t.taskId.toString() === id,
        );

        if (!alreadyHasTask) {
          usersToAddTask.push(user._id);
        }
      }

      if (usersToAddTask.length > 0) {
        await User.updateMany(
          { _id: { $in: usersToAddTask } },
          {
            $addToSet: {
              tasks: {
                taskId: id,
                unit: 'DSMM',
                type: 'Task',
                category: 'DSMMTask',
              },
            },
          },
          { session },
        );
      }

      task.selectedManpower = selectedManpower as Types.ObjectId[];
    } else {
      task.selectedManpower = [];
    }

    // 🔷 Update other task fields
    Object.assign(task, {
      title: payLoad.title ?? task.title,
      taskDate: payLoad.taskDate ?? task.taskDate,
      startTime: payLoad.startTime ?? task.startTime,
      endTime: payLoad.endTime ?? task.endTime,
      multiTask: payLoad.multiTask ?? task.multiTask,
      multiTaskId: payLoad.multiTaskId ?? task.multiTaskId,
      status: payLoad.status ?? task.status,
    });

    const updatedTask = await task.save({ session });
    await session.commitTransaction();

    return updatedTask;
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof AppError) throw error;

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to update DSMM task: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  } finally {
    session.endSession();
  }
};

export const DSMMTaskService = {
  createDSMMTask,
  getAllDSMMTasks,
  updateDSMMTask,
};
