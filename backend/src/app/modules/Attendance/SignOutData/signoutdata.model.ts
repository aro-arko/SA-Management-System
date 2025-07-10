import { model, Schema, Types } from 'mongoose';
import { TSignOutData } from './signoutdata.interface';

const SignOutDataSchema = new Schema<TSignOutData>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    taskId: {
      type: Types.ObjectId,
      required: true,
      ref: 'FixedTimeEvent',
      unique: true,
    },
    attendanceRecord: [
      {
        userId: {
          type: String,
          required: true,
        },
        signInTime: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SignOutDataModel = model<TSignOutData>(
  'SignOutData',
  SignOutDataSchema,
);
