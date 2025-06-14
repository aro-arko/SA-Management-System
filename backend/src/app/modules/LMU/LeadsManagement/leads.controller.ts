import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { leadsServices } from './leads.service';
import httpStatus from 'http-status';

const leadsTaskCreate = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await leadsServices.leadsTaskCreate(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Leads task created successfully',
    data: result,
  });
});

// add activity to leads task
const addActivity = catchAsync(async (req, res) => {
  const user = req.user;
  const taskId = req.params.taskId;
  const data = req.body;

  const result = await leadsServices.addActivity(user, taskId as string, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity added successfully',
    data: result,
  });
});

export const leadsController = {
  leadsTaskCreate,
  addActivity,
};
