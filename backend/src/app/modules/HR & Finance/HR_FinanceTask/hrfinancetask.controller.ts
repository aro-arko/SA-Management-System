import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import httpStatus from 'http-status';

const createHrFinanceTask = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  const result = await hrFinanceTaskService.createHrFinanceTask(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'HR Finance task created successfully',
    data: result,
  });
});

export const HrFinanceTaskController = {
  createHrFinanceTask,
};
