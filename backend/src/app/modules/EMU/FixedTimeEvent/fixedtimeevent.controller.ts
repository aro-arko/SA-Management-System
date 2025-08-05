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

// update a fixed time event
const updateFixedTimeEvent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FixedTimeEventService.updateFixedTimeEvent(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed time event updated successfully',
    data: result,
  });
});

// delete a fixed time event
const deleteFixedTimeEvent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FixedTimeEventService.deleteFixedTimeEvent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed time event deleted successfully',
    data: result,
  });
});

// get a fixed time event by id
const getFixedTimeEventById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await FixedTimeEventService.getFixedTimeEventById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed time event fetched successfully',
    data: result,
  });
});

export const FixedTimeEventController = {
  createFixedTimeEvent,
  getAllFixedTimeEvents,
  updateFixedTimeEvent,
  deleteFixedTimeEvent,
  getFixedTimeEventById,
};
