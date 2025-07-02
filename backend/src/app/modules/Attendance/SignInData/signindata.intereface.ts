import { ObjectId } from 'mongoose';

export type TSignInData = {
  taskId: ObjectId;
  attendanceRecord: [
    {
      userId: string;
      signInTime: Date;
    },
  ];
};
