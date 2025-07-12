import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { DSMMTaskService } from './dsmmtask.service';

const createDSMMTask = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  const result = await DSMMTaskService.createDSMMTask(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'DSMM Task created successfully',
    data: result,
  });
});

// update DSMM Task
const updateDSMMTask = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DSMMTaskService.updateDSMMTask(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'DSMM Task updated successfully',
    data: result,
  });
});

export const DSMMTaskController = {
  createDSMMTask,
  updateDSMMTask,
};
