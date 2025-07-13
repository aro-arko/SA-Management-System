import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';

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
