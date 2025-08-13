import AppError from '../../../errors/AppError';
import { FixedTimeEvent } from '../../EMU/FixedTimeEvent/fixedtimeevent.model';
import { TSignOutData } from './signoutdata.interface';
import httpStatus from 'http-status';
import { SignOutDataModel } from './signoutdata.model';
import { User } from '../../User/user.model';

const createSignOutData = async (payLoad: TSignOutData) => {
  const { taskId } = payLoad;

  const EventTask = await FixedTimeEvent.findById(taskId, { title: 1 });

  if (!EventTask) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const taskTitle = EventTask.title;

  payLoad.title = taskTitle + ' Sign-out Data';

  //   checking if taskId is already present in the database
  const existingSignInData = await SignOutDataModel.findOne({ taskId: taskId });

  if (existingSignInData) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Sign-out data for this task already exists',
    );
  }

  const result = await SignOutDataModel.create(payLoad);

  return result;
};

// sign out attendance
const signOutAttendance = async (
  id: string,
  taskId: string,
  payLoad: { email: string; password: string },
) => {
  const { email, password } = payLoad;
  const attendanceRecord = await SignOutDataModel.findById(id).lean();

  // 1. Find and validate user
  const user = await User.findOne({ email }).select('+password').lean();

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === 'inactive') {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your account is inactive. Please contact support.',
    );
  }

  const isPasswordValid = await User.isPasswordMatched(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  //   2. Find and validate event
  const event = await FixedTimeEvent.findById(taskId).lean();
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }
  if (event.status === 'completed') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Event is already completed');
  }

  const isUserInEvent = event.selectedManpower.some(
    (manpower) => manpower.toString() === user._id.toString(),
  );

  if (!isUserInEvent) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not part of the event manpower',
    );
  }

  if (attendanceRecord?.taskId?.toString() !== taskId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Event doesn't match with attendance report",
    );
  }

  //   3. check sign-out status
  const existingSignOut = await SignOutDataModel.findOne({
    taskId,
    'attendanceRecord.userId': user._id,
  }).lean();

  if (existingSignOut) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User has already signed out for this task',
    );
  }

  //   4. Push sign-out record (create document if needed)
  await SignOutDataModel.updateOne(
    { taskId },
    {
      $push: {
        attendanceRecord: {
          userId: user._id,
          signInTime: new Date(),
        },
      },
    },
    { upsert: true },
  );

  return {
    message: 'User attendance signed out successfully',
  };
};

export const SignOutDataService = {
  createSignOutData,
  signOutAttendance,
};
