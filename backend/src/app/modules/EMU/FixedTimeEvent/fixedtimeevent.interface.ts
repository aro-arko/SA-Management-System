import { Types } from 'mongoose';

export type TFixedTimeEvent = {
  title: string;
  type: string;
  unit: string;
  multiTask: boolean;
  multiTaskId?: Types.ObjectId;
  eventDate: Date;
  createdBy: Types.ObjectId;
  selectedManpower: Types.ObjectId[];
  startTime: string;
  endTime: string;
  signInData: Types.ObjectId;
  signOutData: Types.ObjectId;
  status: 'completed' | 'in-progress';
};
