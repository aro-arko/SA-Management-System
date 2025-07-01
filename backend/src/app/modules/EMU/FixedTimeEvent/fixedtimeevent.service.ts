import { JwtPayload } from 'jsonwebtoken';
import { TFixedTimeEvent } from './fixedtimeevent.interface';

const createFixedTimeEvent = async (
  currentUser: JwtPayload,
  payLoad: TFixedTimeEvent,
) => {
  return 'function not implemented yet';
};

export const FixedTimeEventService = {
  createFixedTimeEvent,
};
