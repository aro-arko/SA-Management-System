import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';
import { NewApplicationService } from './newapplications.service';

// apply for new applications
const applyNewApplication = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await NewApplicationService.applyNewApplication(data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'New application submitted successfully',
    data: result,
  });
});

// get all applications
const getAllApplications = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await NewApplicationService.getAllApplications(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

export const NewApplicationController = {
  applyNewApplication,
  getAllApplications,
};
