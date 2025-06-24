import { JwtPayload } from 'jsonwebtoken';
import { TEMUMultitasking } from './emumultitasking.interface';
import { User } from '../../User/user.model';
import { EMUMultiTasking } from './emumultitasking.model';

// Create a new EMU multitasking
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

// get all EMU multi-taskings
const getEMUMultiTaskings = async () => {
  const result = await EMUMultiTasking.find({ status: 'active' }).sort({
    createdAt: -1,
  });
  return result;
};

export const EMUMultiTaskingService = {
  createEmuMultitasking,
  getEMUMultiTaskings,
};
