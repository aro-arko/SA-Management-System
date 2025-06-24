import { model, Schema } from 'mongoose';
import { TEMUMultitasking } from './emumultitasking.interface';

const emuMultitaskingSchema = new Schema<TEMUMultitasking>(
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
    eventDate: {
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
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EMUMultiTasking = model<TEMUMultitasking>(
  'EMUMultitasking',
  emuMultitaskingSchema,
);
