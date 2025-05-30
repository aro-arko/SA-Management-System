import AppError from '../../errors/AppError';
import { TUser } from '../User/user.interface';
import { User } from '../User/user.model';
import httpStatus from 'http-status';
import { createToken } from './auth.utils';
import config from '../../config';

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

const loginUser = async (payLoad: { email: string; password: string }) => {
  const userData = { ...payLoad };
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    !(await User.isPasswordMatched(userData.password as string, user.password))
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  // jwt token generation
  const jwtPayload = {
    email: user.email,
    unit: user.unit,
    role: user.role,
  };

  // accessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken: accessToken };
};

export const authService = {
  createUser,
  loginUser,
};
