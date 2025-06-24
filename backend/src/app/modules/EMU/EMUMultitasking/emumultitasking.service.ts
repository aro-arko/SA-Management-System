import { JwtPayload } from 'jsonwebtoken';
import { TEMUMultitasking } from './emumultitasking.interface';
import { User } from '../../User/user.model';
import { EMUMultiTasking } from './emumultitasking.model';

const createEmuMultitasking = async (
  currentUser: JwtPayload,
  payLoad: TEMUMultitasking,
) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new Error('You are not authorized to perform this action');
  }
  payLoad.createdBy = user._id;

  const result = await EMUMultiTasking.create(payLoad);

  return result;
};

export const EMUMultiTaskingService = {
  createEmuMultitasking,
};
