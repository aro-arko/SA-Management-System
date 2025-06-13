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

// get user whatsapp tasks
const getUserWhatsappTasks = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await UserService.getUserWhatsappTasks(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User WhatsApp tasks fetched successfully',
    data: result,
  });
});

// get user task details
const getLeadsTaskDetails = catchAsync(async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const result = await UserService.getLeadsTaskDetails(user, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leads task details fetched successfully',
    data: result,
  });
});

export const UserController = {
  userUpdate,
  getUserWhatsappTasks,
  getLeadsTaskDetails,
};
