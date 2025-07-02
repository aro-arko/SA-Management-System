import { model, Schema, Types } from 'mongoose';
import { TSignInData } from './signindata.intereface';

const SignInDataSchema = new Schema<TSignInData>(
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

export const SignInDataModel = model<TSignInData>(
  'SignInData',
  SignInDataSchema,
);
