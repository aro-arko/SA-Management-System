import { JwtPayload } from 'jsonwebtoken';
import { TGoal } from './lmugoals.interface';
import { User } from '../../User/user.model';
import { LMUGoalModel } from './lmugoals.model';

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

export const lmuGoalsService = {
  createLmuGoal,
};
