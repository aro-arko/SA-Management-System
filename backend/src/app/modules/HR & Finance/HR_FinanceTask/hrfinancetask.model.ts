import { model, Schema } from 'mongoose';
import { THRFinanceTask } from './hrfinancetask.interface';

const hrFinanceTaskSchema = new Schema<THRFinanceTask>(
  {
    title: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      default: 'HR_FINANCE',
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
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
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const HRFinanceTask = model<THRFinanceTask>(
  'HRFinanceTask',
  hrFinanceTaskSchema,
);
