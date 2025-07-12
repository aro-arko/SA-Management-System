import { JwtPayload } from 'jsonwebtoken';
import { TDSMMMultitasking } from './dsmmmultitasking.interface';
import { User } from '../../User/user.model';
import { DSMMMultitasking } from './dsmmmultitasking.model';

const createDSMMMultitasking = async (
  currentUser: JwtPayload,
  payLoad: TDSMMMultitasking,
) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });

  const result = await DSMMMultitasking.create({
    ...payLoad,
    createdBy: user?._id,
  });

  return result;
};

// get all DSMM multi-taskings
const getDSMMMultitasking = async () => {
  const result = await DSMMMultitasking.find({ status: 'active' }).sort({
    createdAt: -1,
  });
  return result;
};

// update DSMM multitaskings
const updateDSMMMultitasking = async (
  id: string,
  payLoad: Partial<TDSMMMultitasking>,
) => {
  const result = await DSMMMultitasking.findByIdAndUpdate(id, payLoad, {
    new: true,
  });
  return result;
};

export const DSMMMultiTaskingService = {
  createDSMMMultitasking,
  getDSMMMultitasking,
  updateDSMMMultitasking,
};
