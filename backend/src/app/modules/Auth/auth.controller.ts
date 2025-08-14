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

// change password
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  const result = await authService.changePassword(
    user,
    oldPassword,
    newPassword,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await authService.forgotPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link sent successfully',
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
  changePassword,
  forgotPassword,
};
