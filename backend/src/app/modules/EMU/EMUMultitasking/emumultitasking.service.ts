import { JwtPayload } from 'jsonwebtoken';
import { TEMUMultitasking } from './emumultitasking.interface';
import { User } from '../../User/user.model';
import { EMUMultiTasking } from './emumultitasking.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../../builder/QueryBuilder';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const categoryModelMap: Record<string, mongoose.Model<any>> = {
//   LeadsTask,
//   // Add other models here
// };

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
const getEMUMultiTaskings = async (query: Record<string, unknown>) => {
  const baseQuery = EMUMultiTasking.find();

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await queryBuilder.modelQuery.lean();
  return result;
};

// update EMU multitaskings
const updateEMUMultiTaskings = async (
  id: string,
  payLoad: TEMUMultitasking,
) => {
  const multitasking = await EMUMultiTasking.findById(id);

  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multitasking not found');
  }

  const result = await EMUMultiTasking.findByIdAndUpdate(
    id,
    {
      ...payLoad,
    },
    { new: true },
  );

  return result;
};

// apply for emu multitasking
const applyEMUMultitasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;

  const user = await User.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this actoin',
    );
  }

  const multitasking = await EMUMultiTasking.findById(id);
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

  const updatedMultitasking = await EMUMultiTasking.findByIdAndUpdate(
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

// devote emu multitasking
const devoteEMUMultiTasking = async (id: string, currentUser: JwtPayload) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });
  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to perform this action',
    );
  }
  const multitasking = await EMUMultiTasking.findById(id);
  if (!multitasking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Multi-tasking not found');
  }
  const isInManpowerList = multitasking.manpower.some(
    (manpower) => manpower.userId.toString() === user._id.toString(),
  );
  if (!isInManpowerList) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not assigned to this multi-tasking',
    );
  }

  if (isInManpowerList) {
    multitasking.manpower = multitasking.manpower.filter(
      (manpower) => manpower.userId.toString() !== user._id.toString(),
    );
    await multitasking.save();
  }
  return multitasking;
};

// remove someone from multitasking
// const rejectFromEMUMultiTasking = async (
//   id: string,
//   currentUser: JwtPayload,
//   data: { userId: string },
// ) => {
//   const { email } = currentUser;
//   const user = await User.findOne({ email }, { _id: 1 });
//   if (!user) {
//     throw new AppError(
//       httpStatus.UNAUTHORIZED,
//       'You are not authorized to perform this action',
//     );
//   }

//   const multitasking = await EMUMultiTasking.findById(id);
//   if (!multitasking) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Multi-tasking not found');
//   }

//   const targetUser = await User.findById(data.userId, { _id: 1 });
//   if (!targetUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Target user not found');
//   }

//   // Check if user has task linked to this multitasking
//   for (const task of targetUser.tasks || []) {
//     const { category, taskId } = task;
//     if (!category || !taskId) continue;

//     const Model = categoryModelMap[category];
//   }
// };

export const EMUMultiTaskingService = {
  createEmuMultitasking,
  getEMUMultiTaskings,
  updateEMUMultiTaskings,
  applyEMUMultitasking,
  devoteEMUMultiTasking,
};
