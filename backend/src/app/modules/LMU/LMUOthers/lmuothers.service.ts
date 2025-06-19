import { JwtPayload } from 'jsonwebtoken';
import { TLMUOthersTask } from './lmuothers.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';
import { LMUOthersTask } from './lmuothers.model';

const createOthersTask = async (
  currentUser: JwtPayload,
  payLoad: TLMUOthersTask,
) => {
  const { email } = currentUser;
  const { assignedTo, multiTask, multiTaskId } = payLoad;

  const currentUserData = await User.findOne({ email }).select('_id');
  if (!currentUserData) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  if (multiTask && !multiTaskId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Multi-task ID is required for multi-tasking',
    );
  }

  if (!assignedTo || assignedTo.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'At least one assignee required',
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const assignedUsers = await User.find({ _id: { $in: assignedTo } }).session(
      session,
    );
    const validUserIds: mongoose.Types.ObjectId[] = [];

    // Validate each user
    for (const user of assignedUsers) {
      const isLMUMember = user.unit === 'LMU';
      let isValidMultiTaskMember = false;

      if (!isLMUMember) {
        if (!multiTask || !multiTaskId) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Non-LMU users must be part of multitasking',
          );
        }

        const multiTaskGroup =
          await LMUMultiTasking.findById(multiTaskId).session(session);
        if (!multiTaskGroup || multiTaskGroup.status !== 'active') {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid or inactive multitasking group',
          );
        }

        const isInTeam = multiTaskGroup.manpower.some(
          (m) => m.userId.toString() === user._id.toString(),
        );

        if (!isInTeam) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `User is not in multitasking group`,
          );
        }

        isValidMultiTaskMember = true;
      }

      if (isLMUMember || isValidMultiTaskMember) {
        validUserIds.push(user._id);
      }
    }

    // Create the task
    const task = await LMUOthersTask.create(
      [
        {
          ...payLoad,
          assignedTo: validUserIds,
          createdBy: currentUserData._id,
        },
      ],
      { session },
    );

    // Update users' task lists
    const userUpdates = validUserIds.map((userId) =>
      User.findByIdAndUpdate(
        userId,
        {
          $push: {
            tasks: {
              taskId: task[0]._id,
              unit: 'LMU',
              type: 'Others',
              category: 'LMUOthersTask',
            },
          },
        },
        { session },
      ),
    );

    await Promise.all(userUpdates);

    await session.commitTransaction();
    return task[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Update others task
const updateOthersTask = async (id: string, payLoad: TLMUOthersTask) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const task = await LMUOthersTask.findById(id).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    const currentUsers = task.assignedTo.map((user) => user.toString());
    const updatedUsers = payLoad.assignedTo?.map(String) || [];

    // Handle removed users
    const removedUsers = currentUsers.filter(
      (user) => !updatedUsers.includes(user),
    );
    if (removedUsers.length) {
      await LMUOthersTask.updateOne(
        { _id: id },
        { $pull: { assignedTo: { $in: removedUsers } } },
        { session },
      );

      await User.updateMany(
        { _id: { $in: removedUsers } },
        {
          $pull: {
            tasks: {
              taskId: id,
              unit: 'LMU',
              type: 'Others',
              category: 'LMUOthersTask',
            },
          },
        },
        { session },
      );
    }

    // Handle new users
    const newUsers = updatedUsers.filter(
      (user) => !currentUsers.includes(user),
    );
    const validUserIds: mongoose.Types.ObjectId[] = [];

    if (newUsers.length) {
      const assignedUsers = await User.find({ _id: { $in: newUsers } }).session(
        session,
      );

      for (const user of assignedUsers) {
        const isLMUMember = user.unit === 'LMU';

        if (!isLMUMember) {
          if (!payLoad.multiTask || !payLoad.multiTaskId) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              'Non-LMU users must be part of multitasking',
            );
          }

          const multiTaskGroup = await LMUMultiTasking.findById(
            payLoad.multiTaskId,
          ).session(session);
          if (!multiTaskGroup || multiTaskGroup.status !== 'active') {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              'Invalid or inactive multitasking group',
            );
          }

          const isInTeam = multiTaskGroup.manpower.some(
            (m) => m.userId.toString() === user._id.toString(),
          );

          if (!isInTeam) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              'User is not in multitasking group',
            );
          }
        }

        validUserIds.push(user._id);
      }

      // Add unique valid users to task
      task.assignedTo.push(...validUserIds);

      // Update users' task list in one go
      await User.updateMany(
        { _id: { $in: validUserIds } },
        {
          $push: {
            tasks: {
              taskId: task._id,
              unit: 'LMU',
              type: 'Others',
              category: 'LMUOthersTask',
            },
          },
        },
        { session },
      );
    }

    // Update task details
    Object.assign(task, payLoad);
    await task.save({ session });

    await session.commitTransaction();
    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const LMUOthersService = {
  createOthersTask,
  updateOthersTask,
};
