import { User } from './user.model';

const userUpdate = async (
  email: string,
  updateData: Partial<typeof User.prototype>,
) => {
  if (!email) {
    throw new Error('Email is required to update user');
  }

  const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

export const UserService = {
  userUpdate,
};
