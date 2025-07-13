import { JwtPayload } from 'jsonwebtoken';
import { THRFinanceTask } from './hrfinancetask.interface';
import { HRFinanceTask } from './hrfinancetask.model';
import { User } from '../../User/user.model';
import mongoose from 'mongoose';
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

export const HrFinanceTaskService = {
  createHrFinanceTask,
  getAllHrFinanceTasks,
};
