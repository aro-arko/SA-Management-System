import { model, Schema } from 'mongoose';
import { TLMUMultitasking } from './lmumultitasking.interface';

const lmuMultiTaskingSchema = new Schema<TLMUMultitasking>(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['whatsapp', 'calling', 'email', 'data-entry', 'others'],
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LMUMultiTasking = model<TLMUMultitasking>(
  'LMUMultitasking',
  lmuMultiTaskingSchema,
);
