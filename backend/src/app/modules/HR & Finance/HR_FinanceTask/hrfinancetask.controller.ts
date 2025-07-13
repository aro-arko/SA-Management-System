import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { HrFinanceTaskService } from './hrfinancetask.service';

const createHrFinanceTask = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  const result = await HrFinanceTaskService.createHrFinanceTask(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'HR Finance task created successfully',
    data: result,
  });
});

// get all HR Finance tasks
const getAllHrFinanceTasks = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await HrFinanceTaskService.getAllHrFinanceTasks(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR Finance tasks retrieved successfully',
    data: result,
  });
});

// update HR Finance task
const updateHrFinanceTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const data = req.body;

  const result = await HrFinanceTaskService.updateHrFinanceTask(taskId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR Finance task updated successfully',
    data: result,
  });
});

// delete HR Finance task
const deleteHrFinanceTask = catchAsync(async (req, res) => {
  const taskId = req.params.taskId;

  const result = await HrFinanceTaskService.deleteHrFinanceTask(taskId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'HR Finance task deleted successfully',
    data: result,
  });
});

export const HrFinanceTaskController = {
  createHrFinanceTask,
  getAllHrFinanceTasks,
  updateHrFinanceTask,
  deleteHrFinanceTask,
};
