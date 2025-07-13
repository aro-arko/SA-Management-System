import { Types } from 'mongoose';

export type TDSMMTask = {
  title: string;
  unit: string;
  type: string;
  details: string;
  multiTask: boolean;
  multiTaskId: Types.ObjectId;
  taskDate: Date;
  startTime: Date;
  endTime: Date;
  selectedManpower: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  status: 'completed' | 'in-progress';
};
