import AppError from '../../../errors/AppError';
import { FixedTimeEvent } from '../../EMU/FixedTimeEvent/fixedtimeevent.model';
import { User } from '../../User/user.model';
import { TSignInData } from './signindata.interface';
import { SignInDataModel } from './signindata.model';
import httpStatus from 'http-status';

const createSignInData = async (payLoad: TSignInData) => {
  const { taskId } = payLoad;

  const EventTask = await FixedTimeEvent.findById(taskId, { title: 1 });
  if (!EventTask) {
    throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const taskTitle = EventTask.title;
  payLoad.title = taskTitle + ' Sign-in Data';

  //   checking if taskId is already present in the database
  const existingSignInData = await SignInDataModel.findOne({ taskId: taskId });
  if (existingSignInData) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Sign-in data for this task already exists',
    );
  }
  const result = await SignInDataModel.create(payLoad);
  return result;
};

// sign in attendance
const signInAttendance = async (
  id: string,
  taskId: string,
  payLoad: { email: string; password: string },
) => {
  const { email, password } = payLoad;

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

  // 2. Find and validate event
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

  // 3. Check sign-in status
  const existingSignIn = await SignInDataModel.findOne({
    taskId,
    'attendanceRecord.userId': user._id,
  }).lean();

  if (existingSignIn) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User has already signed in');
  }

  // 4. Push sign-in record (create document if needed)
  await SignInDataModel.updateOne(
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
    message: 'User attendance signed in successfully',
    userId: user._id,
    taskId,
  };
};

export const SignInDataService = {
  createSignInData,
  signInAttendance,
};
