import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendReponse';
import { FixedTimeEventService } from './fixedtimeevent.service';
import httpStatus from 'http-status';

const createFixedTimeEvent = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;

  const result = await FixedTimeEventService.createFixedTimeEvent(user, data);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Fixed time event created successfully',
    data: result,
  });
});

// get all fixed time events
const getAllFixedTimeEvents = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await FixedTimeEventService.getAllFixedTimeEvents(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed time events fetched successfully',
    data: result,
  });
});

export const FixedTimeEventController = {
  createFixedTimeEvent,
  getAllFixedTimeEvents,
};
