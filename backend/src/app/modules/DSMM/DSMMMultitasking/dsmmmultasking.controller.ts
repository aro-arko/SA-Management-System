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

export const DSMMMultitaskingController = {
  createDSMMMultitasking,
};
