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

export const EMUMultiTaskingController = {
  createEmuMultitasking,
};
