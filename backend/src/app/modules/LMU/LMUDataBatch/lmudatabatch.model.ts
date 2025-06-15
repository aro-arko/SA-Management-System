import { model, Schema } from 'mongoose';
import { TLMUDataBatch } from './lmudatabatch.interface';

const LMUDataBatchSchema = new Schema<TLMUDataBatch>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['data-entry'],
      default: 'data-entry',
    },
    assignedSets: {
      type: Number,
      required: true,
    },
    expectedTotalLeads: {
      type: Number,
      required: true,
    },
    completedLeads: {
      type: Number,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DataEntryTask',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LMUDataBatch = model<TLMUDataBatch>(
  'LMUDataBatch',
  LMUDataBatchSchema,
);
