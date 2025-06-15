import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { DataManagementService } from './datamanagement.service';

const createDataEntryTask = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await DataManagementService.createDataEntryTask(user, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data entry task created successfully',
    data: result,
  });
});

// get all data entry tasks
const getAllDataEntryTasks = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await DataManagementService.getAllDataEntryTasks(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data entry tasks retrieved successfully',
    data: result,
  });
});

// update a data entry task
const updateDataEntryTask = catchAsync(async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const result = await DataManagementService.updateDataEntryTask(id, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data entry task updated successfully',
    data: result,
  });
});

export const DataManagementController = {
  createDataEntryTask,
  getAllDataEntryTasks,
  updateDataEntryTask,
};
