import { JwtPayload } from 'jsonwebtoken';
import { TLMUMultitasking } from './lmumultitasking.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import { LMUMultiTasking } from './lmumultitasking.model';
import mongoose from 'mongoose';
import { LeadsTask } from '../LeadsManagement/leads.model';

const createLMUMultitasking = async (
  currentUser: JwtPayload,
  data: TLMUMultitasking,
) => {
  const { email, role } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
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
  const result = await LMUMultiTasking.find({ status: 'active' }).sort({
    createdAt: -1,
  });
  return result;
};

const updateLMUMultitasking = async (
  id: string,
  currentUser: JwtPayload,
  data: Partial<TLMUMultitasking>,
) => {
  const { email, role } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }

  const multitasking = await LMUMultiTasking.findById(id);

  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multitasking not found');
  }

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
    { ...data },
    { new: true },
  );

  return result;
};

const applyLMUMultitasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
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
  const isAlreadyApplied = multitasking.manpower.some(
    (manpower) => manpower.userId.toString() === user._id.toString(),
  );
  if (isAlreadyApplied) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already applied for this multi-tasking',
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

const devoteLMUMultitasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
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

  const isAlreadyDevoted = multitasking.manpower.some(
    (manpower) => manpower.userId.toString() === user._id.toString(),
  );
  if (!isAlreadyDevoted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have not applied for this multi-tasking',
    );
  }
  if (isAlreadyDevoted) {
    multitasking.manpower = multitasking.manpower.filter(
      (manpower) => manpower.userId.toString() !== user._id.toString(),
    );
    await multitasking.save();
  }

  return multitasking;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryModelMap: Record<string, mongoose.Model<any>> = {
  LeadsTask,
  // Add other models here
};

const rejectLMUMultitasking = async (
  id: string,
  currentUser: JwtPayload,
  data: { userId: string },
) => {
  const { email, role } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const multitasking = await LMUMultiTasking.findById(id);
  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multi-tasking not found');
  }

  if (role === 'lmuDataLeader' && multitasking.type !== 'data-entry') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Data entry leader can only remove users from data entry multitasking',
    );
  }

  const targetUser = await User.findById(data.userId, { _id: 1 });
  if (!targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Target user not found');
  }

  // ✅ Check if user has task linked to this multitasking
  for (const task of targetUser.tasks || []) {
    const { category, taskId } = task;
    if (!category || !taskId) continue;

    const Model = categoryModelMap[category];
    if (!Model) continue;

    const matchedTask = await Model.findOne({
      _id: taskId,
      multiTaskId: multitasking._id,
    }).lean();

    if (matchedTask) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'User is already assigned to a task linked with this multi-tasking',
      );
    }
  }

  // Proceed to remove from multitasking
  multitasking.manpower = multitasking.manpower.filter(
    (manpower) => manpower.userId.toString() !== data.userId,
  );
  await multitasking.save();

  return multitasking;
};

export const LMUMultiTaskingServices = {
  createLMUMultitasking,
  getLMUMultitaskings,
  updateLMUMultitasking,
  applyLMUMultitasking,
  devoteLMUMultitasking,
  rejectLMUMultitasking,
};
