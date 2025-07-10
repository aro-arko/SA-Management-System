import { ObjectId } from 'mongoose';

export type TSignOutData = {
  title: string;
  taskId: ObjectId;
  attendanceRecord: [
    {
      userId: string;
      signInTime: Date;
    },
  ];
};
