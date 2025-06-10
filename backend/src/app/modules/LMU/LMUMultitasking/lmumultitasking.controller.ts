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

export const LMUMultiTaskingController = {
  createLMUMultiTasking,
};
