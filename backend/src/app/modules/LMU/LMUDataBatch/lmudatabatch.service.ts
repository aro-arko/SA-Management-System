import { JwtPayload } from 'jsonwebtoken';
import { TLMUDataBatch } from './lmudatabatch.interface';
import { User } from '../../User/user.model';
import { LMUDataBatch } from './lmudatabatch.model';

// create a new LMU Data Batch
const createDataBatch = async (
  currentUser: JwtPayload,
  payLoad: Partial<TLMUDataBatch>,
) => {
  const { email } = currentUser;
  const user = await User.findOne({ email }, { _id: 1 });

  //   assigning the user to the createdBy field
  if (!user) {
    throw new Error('Please login to create a data batch');
  }
  payLoad.createdBy = user._id;

  const result = await LMUDataBatch.create(payLoad);
  return result;
};

export const LMUDataBatchService = {
  createDataBatch,
};
