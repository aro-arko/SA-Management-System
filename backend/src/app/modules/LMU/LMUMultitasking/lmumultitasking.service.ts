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
  const { email, role } = currentUser;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  //   preventing data entry leader to create other types of multitasking
  if (role === 'lmuDataLeader' && data.type !== 'data-entry') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Data entry leader can only create data entry multitasking',
    );
  }

  data.createdBy = user._id;

  const result = await LMUMultiTasking.create(data);
  return result;
};

const getLMUMultitaskings = async () => {
  const result = await LMUMultiTasking.find().sort({ createdAt: -1 });
  return result;
};

const updateLMUMultitasking = async (
  id: string,
  currentUser: JwtPayload,
  data: Partial<TLMUMultitasking>,
) => {
  const { email, role } = currentUser;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  const multitasking = await LMUMultiTasking.findById(id);

  //   preventing data entry leader to update other types of multitasking
  if (
    role === 'lmuDataLeader' &&
    data.type &&
    multitasking!.type !== 'data-entry'
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Data entry leader can only update data entry multitasking',
    );
  }
  const result = await LMUMultiTasking.findByIdAndUpdate(
    id,
    { ...data, updatedBy: user._id },
    { new: true },
  );

  return result;
};

const applyLMUMultitasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  const multitasking = await LMUMultiTasking.findById(id);
  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multi-tasking not found');
  }
  if (multitasking.status === 'inactive') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This multi-tasking is currently inactive',
    );
  }
  const updatedMultitasking = await LMUMultiTasking.findByIdAndUpdate(
    id,
    {
      $addToSet: { manpower: { userId: user._id } },
    },
    { new: true },
  );
  return updatedMultitasking;
};

export const LMUMultiTaskingServices = {
  createLMUMultitasking,
  getLMUMultitaskings,
  updateLMUMultitasking,
  applyLMUMultitasking,
};
