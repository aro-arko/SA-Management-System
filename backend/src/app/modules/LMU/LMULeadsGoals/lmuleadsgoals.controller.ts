import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { lmuGoalsService } from './lmuleadsgoals.service';

const getLmuGoalById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await lmuGoalsService.getLmuGoalById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal retrieved successfully',
    data: result,
  });
});

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
  const result = await lmuGoalsService.getAllLmuGoals(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goals retrieved successfully',
    data: result,
  });
});

const updateLmuGoal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await lmuGoalsService.updateLmuGoal(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal updated successfully',
    data: result,
  });
});

export const lmuGoalsController = {
  createLmuGoal,
  getAllLmuGoals,
  updateLmuGoal,
  getLmuGoalById,
};
