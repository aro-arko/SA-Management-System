import { Types } from 'mongoose';

export type TDSMMMultitasking = {
  title: string;
  manpower: {
    userId: Types.ObjectId;
  }[];
  taskDate: Date;
  startTime: Date;
  endTime: Date;
  createdBy: Types.ObjectId;
  status: 'active' | 'inactive';
};
