import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { DSMMMultiTaskingService } from './dsmmmultitasking.service';

const createDSMMMultitasking = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await DSMMMultiTaskingService.createDSMMMultitasking(
    user,
    data,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Multi-tasking created successfully',
    data: result,
  });
});

// get all DSMM multi-taskings
const getDSMMMultitasking = catchAsync(async (req, res) => {
  const result = await DSMMMultiTaskingService.getDSMMMultitasking();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking retrieved successfully',
    data: result,
  });
});

// update DSMM multitaskings
const updateDSMMMultitasking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DSMMMultiTaskingService.updateDSMMMultitasking(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking updated successfully',
    data: result,
  });
});

export const DSMMMultitaskingController = {
  createDSMMMultitasking,
  getDSMMMultitasking,
  updateDSMMMultitasking,
};
