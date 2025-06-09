import { JwtPayload } from 'jsonwebtoken';
import { TGoal } from './lmugoals.interface';
import { User } from '../../User/user.model';
import { LMUGoalModel } from './lmugoals.model';
import QueryBuilder from '../../../builder/QueryBuilder';

// Service for creating and fetching LMU goals
const createLmuGoal = async (currentUser: JwtPayload, data: TGoal) => {
  const { email } = currentUser;
  const user = await User.findOne({ email });

  //   assigning the user to the createdBy field
  if (!user) {
    throw new Error('Please login to create a goal');
  }
  data.createdBy = user._id;

  const result = await LMUGoalModel.create(data);
  return result;
};

// all goals will be fetched by the user
const getAllLmuGoals = async (query: Record<string, unknown>) => {
  const modelQuery = LMUGoalModel.find();
  const queryBuilder = new QueryBuilder(modelQuery, query);
  queryBuilder.sort().paginate();

  const result = await queryBuilder.modelQuery;

  return result;
};

export const lmuGoalsService = {
  createLmuGoal,
  getAllLmuGoals,
};
