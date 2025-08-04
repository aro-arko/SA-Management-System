import { JwtPayload } from 'jsonwebtoken';
import { TGoal } from './lmuleadsgoals.interface';
import { User } from '../../User/user.model';
import { LMULeadsGoal } from './lmuleadsgoals.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

const getLmuGoalById = async (id: string) => {
  const result = await LMULeadsGoal.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Goal not found');
  }
  return result;
};

const createLmuGoal = async (currentUser: JwtPayload, data: TGoal) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });

  //   assigning the user to the createdBy field
  if (!user) {
    throw new Error('Please login to create a goal');
  }
  data.createdBy = user._id;

  const result = await LMULeadsGoal.create(data);
  return result;
};

// all goals will be fetched by the user
const getAllLmuGoals = async (query: Record<string, unknown>) => {
  const modelQuery = LMULeadsGoal.find();
  const queryBuilder = new QueryBuilder(modelQuery, query);
  queryBuilder.sort().paginate();

  const result = await queryBuilder.modelQuery;

  return result;
};

const updateLmuGoal = async (id: string, data: TGoal) => {
  const existingGoal = await LMULeadsGoal.findById(id);
  if (!existingGoal) {
    throw new AppError(httpStatus.NOT_FOUND, 'Goal not found');
  }

  // If trying to update the type, ensure the goal has no tasks
  if (data.type && existingGoal.tasks.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot update goal type when tasks are associated',
    );
  }

  const result = await LMULeadsGoal.findByIdAndUpdate(id, data, {
    new: true,
  });

  return result;
};

export const lmuGoalsService = {
  createLmuGoal,
  getAllLmuGoals,
  updateLmuGoal,
  getLmuGoalById,
};
