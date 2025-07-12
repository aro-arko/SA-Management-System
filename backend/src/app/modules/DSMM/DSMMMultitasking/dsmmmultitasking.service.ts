import { JwtPayload } from 'jsonwebtoken';
import { TDSMMMultitasking } from './dsmmmultitasking.interface';
import { User } from '../../User/user.model';
import { DSMMMultitasking } from './dsmmmultitasking.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

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

// apply for DSMM multitasking
const applyDSMMMultitasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;

  const user = await User.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  const multitasking = await DSMMMultitasking.findById(id);
  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multitasking not found');
  }
  if (multitasking.status === 'inactive') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This mult-tasking is currently inactive',
    );
  }

  const isAlreadyApplied = multitasking.manpower.some(
    (manpower) => manpower.userId.toString() === user._id.toString(),
  );

  if (isAlreadyApplied) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already applied for this multitasking',
    );
  }

  const updatedMultitasking = await DSMMMultitasking.findByIdAndUpdate(
    id,
    {
      $addToSet: { manpower: { userId: user._id } },
    },
    {
      new: true,
    },
  );

  return updatedMultitasking;
};

export const DSMMMultiTaskingService = {
  createDSMMMultitasking,
  getDSMMMultitasking,
  updateDSMMMultitasking,
  applyDSMMMultitasking,
};
