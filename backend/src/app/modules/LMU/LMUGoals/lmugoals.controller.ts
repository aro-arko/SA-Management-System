import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { lmuGoalsService } from './lmugoals.service';

// This controller handles the creation and retrieval of LMU goals.
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

// This controller retrieves all LMU goals.
const getAllLmuGoals = catchAsync(async (req, res) => {
  const result = await lmuGoalsService.getAllLmuGoals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goals retrieved successfully',
    data: result,
  });
});

export const lmuGoalsController = {
  createLmuGoal,
  getAllLmuGoals,
};
