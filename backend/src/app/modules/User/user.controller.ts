import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendReponse';
import { UserService } from './user.service';
import httpStatus from 'http-status';

const userUpdate = catchAsync(async (req, res) => {
  const email = req.body.email;
  const newData = req.body.body;

  const currentUser = req.user;
  // console.log(currentUser);

  const result = await UserService.userUpdate(currentUser, email, newData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const UserController = {
  userUpdate,
};
