import { ObjectId } from 'mongoose';

export type TSignInData = {
  title: string;
  taskId: ObjectId;
  attendanceRecord: [
    {
      userId: string;
      signInTime: Date;
    },
  ];
};
