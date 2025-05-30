import AppError from '../../errors/AppError';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';
import httpStatus from 'http-status';

const createUser = async (payLoad: Partial<TUser>) => {
  const userData = { ...payLoad };

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already exists');
  }

  const newUser = await User.create(userData);
  if (!newUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user',
    );
  }
  return newUser;
};

export const authService = {
  createUser,
};
