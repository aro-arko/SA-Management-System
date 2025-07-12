import { JwtPayload } from 'jsonwebtoken';
import { TDSMMTask } from './dsmmtask.interface';
import { DSMMTask } from './dsmmtask.model';
import { User } from '../../User/user.model';
import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

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

    // ✅ 2️⃣ For each selected manpower, add task to their profile if not already present
    for (const manpowerId of selectedManpower) {
      await User.updateOne(
        {
          _id: manpowerId,
          'tasks.taskId': { $ne: createdTask._id }, // only if not already present
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
