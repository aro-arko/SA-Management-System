import { Types } from 'mongoose';

export type TLMUOthersTask = {
  title: string;
  unit: string;
  type: string;
  details: string;
  multiTask: boolean;
  multiTaskId: Types.ObjectId;
  status: 'in-progress' | 'completed';
  assignedTo: Types.ObjectId[];
  createdBy: Types.ObjectId;
};
