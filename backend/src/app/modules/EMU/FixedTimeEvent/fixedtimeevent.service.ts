import { JwtPayload } from 'jsonwebtoken';
import { TFixedTimeEvent } from './fixedtimeevent.interface';
import { FixedTimeEvent } from './fixedtimeevent.model';
import { User } from '../../User/user.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

const createFixedTimeEvent = async (
  currentUser: JwtPayload,
  payLoad: TFixedTimeEvent,
) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });

  const result = await FixedTimeEvent.create({
    ...payLoad,
    createdBy: user?._id,
  });

  return result;
};

const getAllFixedTimeEvents = async (query: Record<string, unknown>) => {
  const baseQuery = FixedTimeEvent.find(); // No empty populate

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const events = await queryBuilder.modelQuery.lean();

  if (!events.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No events found');
  }
  return events;
};
export const FixedTimeEventService = {
  createFixedTimeEvent,
  getAllFixedTimeEvents,
};
