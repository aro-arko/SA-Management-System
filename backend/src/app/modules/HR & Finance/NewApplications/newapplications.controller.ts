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

// get application details
const getApplicationDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await NewApplicationService.getApplicationDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application details retrieved successfully',
    data: result,
  });
});

// update application status
const updateApplicationStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await NewApplicationService.updateApplicationStatus(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application status updated successfully',
    data: result,
  });
});

export const NewApplicationController = {
  applyNewApplication,
  getAllApplications,
  getApplicationDetails,
  updateApplicationStatus,
};
