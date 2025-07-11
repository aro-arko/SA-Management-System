import { Types } from 'mongoose';

export type TDSMMTask = {
  title: string;
  unit: string;
  details: string;
  multiTask: boolean;
  multiTaskId: Types.ObjectId;
  selectedManpower: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  status: 'completed' | 'in-progress';
};
