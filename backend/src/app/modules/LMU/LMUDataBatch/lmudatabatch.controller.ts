import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { LMUDataBatchService } from './lmudatabatch.service';
import httpStatus from 'http-status';

// create a new LMU Data Batch
const createDataBatch = catchAsync(async (req, res) => {
  const data = req.body;
  const user = req.user;

  const result = await LMUDataBatchService.createDataBatch(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'LMU Data Batch created successfully',
    data: result,
  });
});

// get all LMU Data Batches
const getAllDataBatches = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await LMUDataBatchService.getAllDataBatches(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'LMU Data Batches fetched successfully',
    data: result,
  });
});

export const LMUDataBatchController = {
  createDataBatch,
  getAllDataBatches,
};
