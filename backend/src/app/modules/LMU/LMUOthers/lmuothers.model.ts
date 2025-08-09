import { model, Schema } from 'mongoose';
import { TLMUOthersTask } from './lmuothers.interface';

const LMUOthersTaskSchema = new Schema<TLMUOthersTask>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    unit: {
      type: String,
      trim: true,
      required: true,
      default: 'LMU',
    },
    type: {
      type: String,
      trim: true,
      required: true,
      default: 'Others',
    },
    details: {
      type: String,
      required: true,
    },
    multiTask: {
      type: Boolean,
      default: false,
    },
    multiTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'LMUMultitasking',
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LMUOthersTask = model<TLMUOthersTask>(
  'LMUOthersTask',
  LMUOthersTaskSchema,
);
