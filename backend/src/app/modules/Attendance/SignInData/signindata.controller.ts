import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { SignInDataService } from './signindata.service';
import httpStatus from 'http-status';

const createSignInData = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await SignInDataService.createSignInData(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sign-in data created successfully',
    data: result,
  });
});

// sign in attendance
const signInAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.params;
  const data = req.body;

  const result = await SignInDataService.signInAttendance(id, taskId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sign-in successful',
    data: result,
  });
});

export const SignInDataController = {
  createSignInData,
  signInAttendance,
};
