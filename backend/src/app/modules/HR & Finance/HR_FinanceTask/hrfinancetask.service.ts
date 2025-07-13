import { JwtPayload } from 'jsonwebtoken';
import { THRFinanceTask } from './hrfinancetask.interface';
import { HRFinanceTask } from './hrfinancetask.model';
import { User } from '../../User/user.model';
import mongoose, { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../../builder/QueryBuilder';

const createHrFinanceTask = async (
  currentUser: JwtPayload,
  payLoad: THRFinanceTask,
) => {
  const { email } = currentUser;

  const currentUserDoc = await User.findOne({ email }, { _id: 1 });
  if (!currentUserDoc?._id) {
    throw new AppError(httpStatus.NOT_FOUND, 'Current user not found');
  }

  const session = await mongoose.startSession();

  let createdTask;

  await session.withTransaction(async () => {
    // Fetch assigned user inside transaction
    const assignedUser = await User.findById(payLoad.assignedTo).session(
      session,
    );

    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
    }

    if (assignedUser.unit !== 'HR_FINANCE') {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Assigned user is not from HR Finance unit',
      );
    }

    // Create HR Finance task
    createdTask = await HRFinanceTask.create(
      [
        {
          ...payLoad,
          createdBy: currentUserDoc._id,
        },
      ],
      { session },
    ).then((tasks) => tasks[0]);

    if (!createdTask?._id) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create HR Finance task',
      );
    }

    // Add task to assigned user's profile (if not already there)
    await User.updateOne(
      {
        _id: assignedUser._id,
        'tasks.taskId': { $ne: createdTask._id },
      },
      {
        $addToSet: {
          tasks: {
            taskId: createdTask._id,
            unit: 'HR_FINANCE',
            type: 'Task',
            category: 'HRFinanceTask',
          },
        },
      },
      { session },
    );
  });

  session.endSession();

  return createdTask;
};

// get all HR Finance tasks
const getAllHrFinanceTasks = async (query: Record<string, unknown> = {}) => {
  const baseQuery = HRFinanceTask.find().populate(
    'assignedTo',
    'firstName lastName',
  );

  const queryBuilder = new QueryBuilder(baseQuery, query);

  const tasks = await queryBuilder
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.lean();

  return tasks;
};

// update HR Finance task
const updateHrFinanceTask = async (taskId: string, payLoad: THRFinanceTask) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await HRFinanceTask.findById(taskId).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    const newAssignedTo = payLoad.assignedTo?.toString();
    const oldAssignedTo = task.assignedTo?.toString();

    if (newAssignedTo && newAssignedTo !== oldAssignedTo) {
      const [prevUser, newUser] = await Promise.all([
        User.findById(oldAssignedTo).session(session),
        User.findById(newAssignedTo).session(session),
      ]);

      if (!newUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'New assigned user not found');
      }

      // Remove from previous user
      if (prevUser) {
        await User.updateOne(
          { _id: prevUser._id },
          { $pull: { tasks: { taskId: task._id } } },
          { session },
        );
      }

      // Add to new user if not already assigned
      const alreadyAssigned = newUser.tasks?.some(
        (t) => t.taskId.toString() === taskId,
      );

      if (!alreadyAssigned) {
        await User.updateOne(
          { _id: newUser._id },
          {
            $push: {
              tasks: {
                taskId: task._id,
                unit: 'HR_FINANCE',
                type: 'Task',
                category: 'HRFinanceTask',
              },
            },
          },
          { session },
        );
      }

      task.assignedTo = new Types.ObjectId(newAssignedTo);
    }

    // Update other fields
    Object.assign(task, payLoad);
    const updatedTask = await task.save({ session });

    await session.commitTransaction();
    return updatedTask;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// delete HR Finance task
const deleteHrFinanceTask = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await HRFinanceTask.findById(id).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    await Promise.all([
      User.updateOne(
        { _id: task.assignedTo },
        { $pull: { tasks: { taskId: task._id } } },
        { session },
      ),
      HRFinanceTask.deleteOne({ _id: task._id }, { session }),
    ]);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const HrFinanceTaskService = {
  createHrFinanceTask,
  getAllHrFinanceTasks,
  updateHrFinanceTask,
  deleteHrFinanceTask,
};
