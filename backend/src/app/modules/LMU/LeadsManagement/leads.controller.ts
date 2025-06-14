import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { leadsServices } from './leads.service';
import httpStatus from 'http-status';

const leadsTaskCreate = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await leadsServices.leadsTaskCreate(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Leads task created successfully',
    data: result,
  });
});

// get all leads tasks
const getAllLeadsTasks = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await leadsServices.getAllLeadsTasks(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leads tasks fetched successfully',
    data: result,
  });
});

// add activity to leads task
const addActivity = catchAsync(async (req, res) => {
  const user = req.user;
  const taskId = req.params.taskId;
  const data = req.body;

  const result = await leadsServices.addActivity(user, taskId as string, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity added successfully',
    data: result,
  });
});

// update leads task
const updateTask = catchAsync(async (req, res) => {
  const user = req.user;
  const taskId = req.params.taskId;
  const data = req.body;

  const result = await leadsServices.updateTask(user, taskId as string, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leads task updated successfully',
    data: result,
  });
});

// delete leads task
const deleteTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;

  const result = await leadsServices.deleteTask(taskId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Leads task deleted successfully',
    data: result,
  });
});

export const leadsController = {
  leadsTaskCreate,
  addActivity,
  updateTask,
  deleteTask,
  getAllLeadsTasks,
};
