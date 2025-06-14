import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { DataManagementService } from './datamanagement.service';

const createDataEntryTask = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await DataManagementService.createDataEntryTask(user, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data entry task created successfully',
    data: result,
  });
});

export const DataManagementController = {
  createDataEntryTask,
};
