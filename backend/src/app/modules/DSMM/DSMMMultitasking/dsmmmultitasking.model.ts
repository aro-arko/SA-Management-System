import { model, Schema } from 'mongoose';
import { TDSMMMultitasking } from './dsmmmultitasking.interface';

const dsmmMultitaskingSchema = new Schema<TDSMMMultitasking>(
  {
    title: {
      type: String,
      required: true,
    },
    manpower: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    taskDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const DSMMMultitasking = model<TDSMMMultitasking>(
  'DSMMMultitasking',
  dsmmMultitaskingSchema,
);
