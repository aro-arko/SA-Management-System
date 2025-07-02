import { model, Schema } from 'mongoose';
import { TFixedTimeEvent } from './fixedtimeevent.interface';

const fixedTimeEventSchema = new Schema<TFixedTimeEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    multiTask: {
      type: Boolean,
      required: true,
    },
    multiTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'EMUMultitasking',
    },
    eventDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    selectedManpower: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
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

export const FixedTimeEvent = model<TFixedTimeEvent>(
  'FixedTimeEvent',
  fixedTimeEventSchema,
);
