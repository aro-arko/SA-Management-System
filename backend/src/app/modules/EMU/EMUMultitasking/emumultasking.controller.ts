import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { EMUMultiTaskingService } from './emumultitasking.service';
import httpStatus from 'http-status';

const createEmuMultitasking = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await EMUMultiTaskingService.createEmuMultitasking(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Multi-tasking created successfully',
    data: result,
  });
});

// get all EMU multi-taskings
const getEMUMultiTaskings = catchAsync(async (req, res) => {
  const result = await EMUMultiTaskingService.getEMUMultiTaskings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking retrieved successfully',
    data: result,
  });
});

// update EMU multitaskings
const updateEMUMultiTaskings = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EMUMultiTaskingService.updateEMUMultiTaskings(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking updated successfully',
    data: result,
  });
});

export const EMUMultiTaskingController = {
  createEmuMultitasking,
  getEMUMultiTaskings,
  updateEMUMultiTaskings,
};
