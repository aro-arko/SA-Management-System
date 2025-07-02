import { model, Schema, Types } from 'mongoose';
import { TSignInData } from './signindata.intereface';

const SignInDataSchema = new Schema<TSignInData>(
  {
    taskId: {
      type: Types.ObjectId,
      required: true,
      ref: 'FixedTimeEvent',
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

export const SignInDataModel = model<TSignInData>(
  'SignInData',
  SignInDataSchema,
);
