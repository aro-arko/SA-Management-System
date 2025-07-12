import { JwtPayload } from 'jsonwebtoken';
import { TDSMMTask } from './dsmmtask.interface';
import { DSMMTask } from './dsmmtask.model';
import { User } from '../../User/user.model';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import { DSMMMultitasking } from '../DSMMMultitasking/dsmmmultitasking.model';

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

export const DSMMTaskService = {
  createDSMMTask,
};
