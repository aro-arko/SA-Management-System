import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { LeadsTask } from '../LMU/LeadsManagement/leads.model';
import { DataEntryTask } from '../LMU/DataManagement/datamanagement.model';
import { LMUOthersTask } from '../LMU/LMUOthers/lmuothers.model';
import { DSMMTask } from '../DSMM/DSMMTask/dsmmtask.model';
import { HRFinanceTask } from '../HR & Finance/HR_FinanceTask/hrfinancetask.model';
import { FixedTimeEvent } from '../EMU/FixedTimeEvent/fixedtimeevent.model';
import { LMUMultiTasking } from '../LMU/LMUMultitasking/lmumultitasking.model';
import { EMUMultiTasking } from '../EMU/EMUMultitasking/emumultitasking.model';
import { DSMMMultitasking } from '../DSMM/DSMMMultitasking/dsmmmultitasking.model';
import { TUser } from './user.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryModelMap: Record<string, mongoose.Model<any>> = {
  LeadsTask,
  DataEntryTask,
  LMUOthersTask,
  LMUMultiTasking,
  FixedTimeEvent,
  EMUMultiTasking,
  DSMMTask,
  DSMMMultitasking,
  HRFinanceTask,
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId, {
    firstName: 1,
    lastName: 1,
    _id: 0,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    name: `${user.firstName} ${user.lastName}`,
  };
};

const userUpdate = async (
  currentUser: JwtPayload,
  userId: string,
  updateData: Partial<typeof User.prototype>,
) => {
  if (!userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required');
  }

  const currentUserId = await User.findOne(
    { email: currentUser.email },
    { _id: 1 },
  );
  if (!currentUserId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Current user not found');
  }

  const { role } = updateData;

  if (currentUserId._id.toString() === userId && role) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot change your own role');
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return updatedUser;
};

// update own profile
const updateOwnProfile = async (
  currentUser: JwtPayload,
  updateData: Partial<TUser>,
) => {
  // Find the person who's currently logged in
  const user = await User.findOne({ email: currentUser.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.updateOne(
    {
      $set: updateData,
    },
    {
      new: true,
    },
  );
  return user;
};

const getUserTasks = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const userData = await User.findOne({ email: user.email }, { tasks: 1 });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

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
    });

    const queryBuilder = new QueryBuilder(baseQuery, query)
      .search(['title', 'unit', 'type'])
      .filter()
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

const getAllUsers = async (query: Record<string, unknown>) => {
  const baseQuery = User.find()
    .select({ unit: 1, status: 1 })
    .sort({ firstName: 1 });
  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['firstName', 'lastName', 'email'])
    .filter()
    .paginate()
    .fields();

  const users = await queryBuilder.modelQuery.lean();

  if (!users || users.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No users found');
  }

  return users;
};

// get user details by id
const getUserDetailsById = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// get me
const getMe = async (currentUser: JwtPayload) => {
  const { email } = currentUser;

  const user = await User.findOne({ email }).select('-password -tasks');

  return user;
};

export const UserService = {
  userUpdate,
  getUserTasks,
  getTaskDetails,
  getUserById,
  getAllUsers,
  getUserDetailsById,
  getMe,
  updateOwnProfile,
};
