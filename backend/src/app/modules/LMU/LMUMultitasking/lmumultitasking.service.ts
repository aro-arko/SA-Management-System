import { JwtPayload } from 'jsonwebtoken';
import { TLMUMultitasking } from './lmumultitasking.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import { LMUMultiTasking } from './lmumultitasking.model';

const createLMUMultitasking = async (
  currentUser: JwtPayload,
  data: TLMUMultitasking,
) => {
  const { email } = currentUser;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }
  data.createdBy = user._id;

  const result = await LMUMultiTasking.create(data);
  return result;
};

export const LMUMultiTaskingServices = {
  createLMUMultitasking,
};
