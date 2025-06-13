import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { LeadsTask } from '../LMU/LeadsManagement/leads.model';

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

// get user whatsapp tasks
const getUserWhatsappTasks = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const userData = await User.findOne({ email: user.email });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Extract whatsapp taskIds from user's task list
  const whatsappTaskIds =
    userData.tasks
      ?.filter(
        (task) =>
          task.type === 'whatsapp' &&
          task.category === 'LeadsTask' &&
          task.taskId,
      )
      .map((task) => new Types.ObjectId(task.taskId)) || [];

  if (!whatsappTaskIds.length) return [];

  // Build the base query (default to in-progress)
  const statusFilter =
    query.showAll === 'true' ? {} : { status: 'in-progress' };

  const baseQuery = LeadsTask.find({
    _id: { $in: whatsappTaskIds },
    ...statusFilter,
  });

  // Apply pagination using your reusable QueryBuilder
  const queryBuilder = new QueryBuilder(baseQuery, query).paginate().sort();
  const paginatedTasks = await queryBuilder.modelQuery.lean();

  return paginatedTasks;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryModelMap: Record<string, mongoose.Model<any>> = {
  LeadsTask,
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
  const statusFilter = showAll ? {} : { status: 'in-progress' };

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

export const UserService = {
  userUpdate,
  getUserWhatsappTasks,
  getUserTasks,
};
