import { Types } from 'mongoose';

export type TEMUMultitasking = {
  title: string;
  manpower: {
    userId: Types.ObjectId;
  }[];
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  createdBy: Types.ObjectId;
  status: 'active' | 'inactive';
};
