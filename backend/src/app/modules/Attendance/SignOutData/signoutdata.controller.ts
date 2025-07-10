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

export const SignOutDataController = {
  createSignInData,
};
