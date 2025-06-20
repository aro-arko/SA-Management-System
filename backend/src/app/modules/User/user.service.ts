import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { LeadsTask } from '../LMU/LeadsManagement/leads.model';
import { DataEntryTask } from '../LMU/DataManagement/datamanagement.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryModelMap: Record<string, mongoose.Model<any>> = {
  LeadsTask,
  DataEntryTask,
};

const userUpdate = async (
  currentUser: JwtPayload,
  requestedEmail: string,
  updateData: Partial<typeof User.prototype>,
) => {
  if (!requestedEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required');
  }
  // Check if the current user is trying to update their own role
  const { role } = updateData;

  if (currentUser.email === requestedEmail && role) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot change your own role');
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: requestedEmail },
    updateData,
    {
      new: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return updatedUser;
};

const getUserTasks = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const userData = await User.findOne({ email: user.email }, { tasks: 1 });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const showAll = query.showAll === 'true';
  const statusFilter = showAll
    ? {}
    : { status: { $in: ['in-progress', 'in-checking'] } };

  const groupedTaskIds: Record<string, Types.ObjectId[]> = {};

  userData.tasks?.forEach((task) => {
    const { category, type, taskId } = task;
    if (!category || !type || !taskId) return;
    if (!groupedTaskIds[category]) groupedTaskIds[category] = [];
    groupedTaskIds[category].push(new Types.ObjectId(taskId));
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let allTasks: any[] = [];

  for (const [category, ids] of Object.entries(groupedTaskIds)) {
    const Model = categoryModelMap[category];
    if (!Model) continue;

    const baseQuery = Model.find({
      _id: { $in: ids },
      ...statusFilter,
    });

    const queryBuilder = new QueryBuilder(baseQuery, query)
      .sort()
      .fields()
      .paginate();

    const result = await queryBuilder.modelQuery.lean();
    allTasks.push(...result);
  }

  return allTasks;
};

const getTaskDetails = async (currentUser: JwtPayload, taskId: string) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const privilegedRoles = ['coordinator', 'head', 'lmuAdmin'];
  const dataLeaderRole = 'lmuDataLeader';

  let category: string | undefined;
  let type: string | undefined;

  // Try to get task from user's task list
  const user = await User.findOne(
    { email: currentUser.email, 'tasks.taskId': taskId },
    { 'tasks.$': 1 },
  );

  if (user?.tasks?.length) {
    // Task found in user profile
    ({ category, type } = user.tasks[0]);
  } else if (
    privilegedRoles.includes(currentUser.role) ||
    currentUser.role === dataLeaderRole
  ) {
    // Search across all models
    for (const [cat, Model] of Object.entries(categoryModelMap)) {
      const task = await Model.findById(taskId).lean();
      if (task && !Array.isArray(task)) {
        const taskType = (task as { type?: string }).type;

        if (
          privilegedRoles.includes(currentUser.role) ||
          (currentUser.role === dataLeaderRole && taskType === 'data-entry')
        ) {
          category = cat;
          type = taskType;
          break;
        }
      }
    }
  }

  if (!category || !type) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not allowed to access this task',
    );
  }

  const Model = categoryModelMap[category];
  if (!Model) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `No model found for category: ${category}`,
    );
  }

  const task = await Model.findOne({ _id: taskId, type }).lean();
  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }

  return task;
};

export const UserService = {
  userUpdate,
  getUserTasks,
  getTaskDetails,
};
