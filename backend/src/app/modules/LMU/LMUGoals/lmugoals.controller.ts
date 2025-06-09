import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { lmuGoalsService } from './lmugoals.service';

const createLmuGoal = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await lmuGoalsService.createLmuGoal(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Goal created successfully',
    data: result,
  });
});

export const lmuGoalsController = {
  createLmuGoal,
};
