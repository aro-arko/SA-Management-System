import { Types } from 'mongoose';

export type TFixedTimeEvent = {
  title: string;
  multiTask: boolean;
  multiTaskId?: Types.ObjectId;
  eventDate: Date;
  createdBy: Types.ObjectId;
  selectedManpower: Types.ObjectId[];
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive';
};
