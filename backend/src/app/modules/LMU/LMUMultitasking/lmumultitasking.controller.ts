import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { LMUMultiTaskingServices } from './lmumultitasking.service';
import httpStatus from 'http-status';

const createLMUMultiTasking = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await LMUMultiTaskingServices.createLMUMultitasking(
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

const getLMUMultiTaskings = catchAsync(async (req, res) => {
  const result = await LMUMultiTaskingServices.getLMUMultitaskings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking retrieved successfully',
    data: result,
  });
});

const updateLMUMultiTasking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const data = req.body;

  const result = await LMUMultiTaskingServices.updateLMUMultitasking(
    id,
    user,
    data,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking updated successfully',
    data: result,
  });
});

const applyLMUMultiTasking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await LMUMultiTaskingServices.applyLMUMultitasking(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking applied successfully',
    data: result,
  });
});

const devoteLMUMultiTasking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await LMUMultiTaskingServices.devoteLMUMultitasking(id, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking devoted successfully',
    data: result,
  });
});

const rejectLMUMultiTasking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const data = req.body;
  const result = await LMUMultiTaskingServices.rejectLMUMultitasking(
    id,
    user,
    data,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is removed from multi-tasking successfully',
    data: result,
  });
});

export const LMUMultiTaskingController = {
  createLMUMultiTasking,
  getLMUMultiTaskings,
  updateLMUMultiTasking,
  applyLMUMultiTasking,
  devoteLMUMultiTasking,
  rejectLMUMultiTasking,
};
