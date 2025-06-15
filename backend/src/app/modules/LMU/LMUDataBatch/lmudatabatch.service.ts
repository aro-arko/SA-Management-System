import { JwtPayload } from 'jsonwebtoken';
import { TLMUDataBatch } from './lmudatabatch.interface';

// create a new LMU Data Batch
const createDataBatch = async (
  currentUser: JwtPayload,
  payLoad: Partial<TLMUDataBatch>,
) => {
  return 'not implemented yet';
};

export const LMUDataBatchService = {
  createDataBatch,
};
