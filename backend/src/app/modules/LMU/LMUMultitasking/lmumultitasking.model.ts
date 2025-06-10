import { model, Schema } from 'mongoose';
import { TLMUMultitasking } from './lmumultitasking.interface';

const lmuMultiTaskingSchema = new Schema<TLMUMultitasking>(
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
