import { JwtPayload } from 'jsonwebtoken';
import { TFixedTimeEvent } from './fixedtimeevent.interface';
import { FixedTimeEvent } from './fixedtimeevent.model';
import { User } from '../../User/user.model';

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

export const FixedTimeEventService = {
  createFixedTimeEvent,
};
