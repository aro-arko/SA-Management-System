import { JwtPayload } from 'jsonwebtoken';
import { TDataEntryTask } from './datamanagement.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';
import { DataEntryTask } from './datamanagement.model';

// create a data entry task
const createDataEntryTask = async (
  currentUser: JwtPayload,
  payLoad: TDataEntryTask,
) => {
  const { email } = currentUser;
  const { assignedTo, multiTask, multiTaskId } = payLoad;
  console.log(assignedTo, multiTask, multiTaskId);

  const currentAdmin = await User.findOne({ email }, { _id: 1 }).lean();
  if (!currentAdmin) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const assignedUser = await User.findById(assignedTo, {
      _id: 1,
      unit: 1,
    }).lean();
    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
    }

    const isLMUMember = assignedUser.unit === 'LMU';

    if (!isLMUMember) {
      if (!multiTask || !multiTaskId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not LMU and multitasking details are missing',
        );
      }

      const multitask =
        await LMUMultiTasking.findById(multiTaskId).session(session);
      if (
        !multitask ||
        multitask.status !== 'active' ||
        multitask.type !== 'data-entry'
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid multitasking information',
        );
      }

      const isMember = multitask.manpower.some(
        (m) => m.userId.toString() === assignedTo.toString(),
      );

      if (!isMember) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not in multitasking team',
        );
      }
    }

    // Create the task
    const [createdTask] = await DataEntryTask.create(
      [
        {
          ...payLoad,
          createdBy: currentAdmin._id,
        },
      ],
      { session },
    );

    // Update user's tasks
    await User.findByIdAndUpdate(
      assignedTo,
      {
        $push: {
          tasks: {
            taskId: createdTask._id,
            unit: 'LMU',
            type: 'data-entry',
            category: 'DataEntryTask',
          },
        },
      },
      { session },
    );

    await session.commitTransaction();
    return createdTask;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const DataManagementService = {
  createDataEntryTask,
};
