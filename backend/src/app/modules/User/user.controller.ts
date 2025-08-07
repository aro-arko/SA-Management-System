import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendReponse';
import { UserService } from './user.service';
import httpStatus from 'http-status';

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const userUpdate = catchAsync(async (req, res) => {
  const id = req.params.id;
  const newData = req.body.body;

  const currentUser = req.user;

  const result = await UserService.userUpdate(currentUser, id, newData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

// get user tasks
const getUserTasks = catchAsync(async (req, res) => {
  const user = req.user;
  const query = req.query;
  const result = await UserService.getUserTasks(user, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User tasks fetched successfully',
    data: result,
  });
});

// get task details by taskId
const getTaskDetails = catchAsync(async (req, res) => {
  const user = req.user;
  const taskId = req.params.taskId;

  const result = await UserService.getTaskDetails(user, taskId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task details fetched successfully',
    data: result,
  });
});

// get all users
const getAllUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllUsers(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users fetched successfully',
    data: result,
  });
});

// get user details by id
const getUserDetailsById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const result = await UserService.getUserDetailsById(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User details fetched successfully',
    data: result,
  });
});

// get me
const getMe = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await UserService.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User details fetched successfully',
    data: result,
  });
});

export const UserController = {
  userUpdate,
  getUserTasks,
  getTaskDetails,
  getMe,
  getUserById,
  getAllUsers,
  getUserDetailsById,
};
