import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { LMUOthersService } from './lmuothers.service';

const createOthersTask = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await LMUOthersService.createOthersTask(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'LMU Others Task created successfully',
    data: result,
  });
});

// update others task
const updateOthersTask = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await LMUOthersService.updateOthersTask(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LMU Others Task updated successfully',
    data: result,
  });
});

export const LMUOthersController = {
  createOthersTask,
  updateOthersTask,
};
