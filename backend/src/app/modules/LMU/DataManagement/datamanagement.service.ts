import { JwtPayload } from 'jsonwebtoken';
import { TDataEntryTask } from './datamanagement.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';
import { DataEntryTask } from './datamanagement.model';
import { LMUDataBatch } from '../LMUDataBatch/lmudatabatch.model';
import QueryBuilder from '../../../builder/QueryBuilder';

// create a data entry task
const createDataEntryTask = async (
  currentUser: JwtPayload,
  payLoad: TDataEntryTask,
) => {
  const { email } = currentUser;
  const { batchId, assignedTo, multiTask, multiTaskId } = payLoad;

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
          'Assigned user is not part of LMU and multitasking details are missing',
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
    const createdTask = await DataEntryTask.create(
      [
        {
          ...payLoad,
          createdBy: currentAdmin._id,
        },
      ],
      { session },
    );

    // Update user's tasks
    const userUpdatePromise = await User.findByIdAndUpdate(
      assignedTo,
      {
        $push: {
          tasks: {
            taskId: createdTask[0]._id,
            unit: 'LMU',
            type: 'data-entry',
            category: 'DataEntryTask',
          },
        },
      },
      { session },
    );

    // update batchId if provided
    let batchUpdatePromise = Promise.resolve();
    if (batchId) {
      batchUpdatePromise = (async () => {
        const dataBatch = await LMUDataBatch.findById(batchId).session(session);
        if (!dataBatch) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            'Data batch not found or inactive',
          );
        }
        if (!dataBatch.isActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Data batch is not active',
          );
        }
        if (dataBatch.type !== 'data-entry') {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Data batch type does not match with task type',
          );
        }

        dataBatch.expectedTotalLeads += payLoad.schoolTeamTotalLeads;
        dataBatch.tasks.push(createdTask[0]._id);
        dataBatch.assignedSets = dataBatch.tasks.length;
        await dataBatch.save({ session });
      })();
    }
    await Promise.all([userUpdatePromise, batchUpdatePromise]);
    await session.commitTransaction();
    return createdTask[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// get all data entry tasks
const getAllDataEntryTasks = async (query: Record<string, unknown>) => {
  const baseQuery = DataEntryTask.find()
    .populate('assignedTo', 'lastName')
    .populate('batchId', 'title type status');

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const tasks = await queryBuilder.modelQuery.lean();

  if (!tasks.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No data entry tasks found');
  }

  return tasks;
};

// update a data entry task

const updateDataEntryTask = async (
  id: string,
  payLoad: Partial<TDataEntryTask>,
) => {
  return 'not implemented yet';
};

export const DataManagementService = {
  createDataEntryTask,
  getAllDataEntryTasks,
  updateDataEntryTask,
};
