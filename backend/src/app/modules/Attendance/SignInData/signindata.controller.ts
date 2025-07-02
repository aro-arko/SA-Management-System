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

export const SignInDataController = {
  createSignInData,
};
