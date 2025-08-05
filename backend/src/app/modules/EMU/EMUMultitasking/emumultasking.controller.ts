import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { EMUMultiTaskingService } from './emumultitasking.service';
import httpStatus from 'http-status';

const createEmuMultitasking = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await EMUMultiTaskingService.createEmuMultitasking(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Multi-tasking created successfully',
    data: result,
  });
});

// get all EMU multi-taskings
const getEMUMultiTaskings = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await EMUMultiTaskingService.getEMUMultiTaskings(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking retrieved successfully',
    data: result,
  });
});

// update EMU multitaskings
const updateEMUMultiTaskings = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EMUMultiTaskingService.updateEMUMultiTaskings(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking updated successfully',
    data: result,
  });
});

// apply for emu multitasking
const applyEMUMultiTasking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = req.user;

  const result = await EMUMultiTaskingService.applyEMUMultitasking(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Multi-tasking applied successfully',
    data: result,
  });
});

// devote emu multitasking
// const devoteEMUMultiTasking = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const user = req.user;

//   const result = await EMUMultiTaskingService.devoteEMUMultiTasking(id, user);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Multi-tasking devoted successfully',
//     data: result,
//   });
// });

// remove someone from multitasking
// const rejectFromEMUMultiTasking = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const { userId } = req.body;
//   const data = req.body;

//   const result = await EMUMultiTaskingService.rejectFromEMUMultiTasking(
//     id,
//     userId,
//     data,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User removed from multi-tasking successfully',
//     data: result,
//   });
// });

export const EMUMultiTaskingController = {
  createEmuMultitasking,
  getEMUMultiTaskings,
  updateEMUMultiTaskings,
  applyEMUMultiTasking,
  // devoteEMUMultiTasking,
  // rejectFromEMUMultiTasking,
};
