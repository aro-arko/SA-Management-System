import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { SignOutDataService } from './signoutdata.service';

const createSignInData = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await SignOutDataService.createSignOutData(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sign-out data created successfully',
    data: result,
  });
});

// sign out attendance
const signOutData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.params;
  const data = req.body;

  const result = await SignOutDataService.signOutAttendance(id, taskId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign-out successful',
    data: result,
  });
});

export const SignOutDataController = {
  createSignInData,
  signOutData,
};
