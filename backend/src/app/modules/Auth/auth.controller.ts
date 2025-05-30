import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendReponse';
import { authService } from './auth.service';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await authService.createUser(data);
  res.status(200).json({
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await authService.loginUser(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
};
