import { JwtPayload } from 'jsonwebtoken';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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

export const UserService = {
  userUpdate,
};
