import { Types } from 'mongoose';

export type TLMUOthersTask = {
  title: string;
  unit: string;
  type: string;
  details: string;
  mulitTask: boolean;
  multiTaskId: Types.ObjectId;
  assignedTo: Types.ObjectId[];
  cretedBy: Types.ObjectId;
};
