import AppError from '../../../errors/AppError';
import { FixedTimeEvent } from '../../EMU/FixedTimeEvent/fixedtimeevent.model';
import { TSignOutData } from './signoutdata.interface';
import httpStatus from 'http-status';
import { SignOutDataModel } from './signoutdata.model';

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

export const SignOutDataService = {
  createSignOutData,
};
