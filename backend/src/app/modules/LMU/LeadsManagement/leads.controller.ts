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

export const leadsController = {
  leadsTaskCreate,
};
