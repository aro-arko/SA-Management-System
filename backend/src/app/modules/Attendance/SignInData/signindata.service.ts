import AppError from '../../../errors/AppError';
import { FixedTimeEvent } from '../../EMU/FixedTimeEvent/fixedtimeevent.model';
import { TSignInData } from './signindata.intereface';
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

export const SignInDataService = {
  createSignInData,
};
