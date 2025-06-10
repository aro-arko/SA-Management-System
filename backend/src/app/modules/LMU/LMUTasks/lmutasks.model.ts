import { model, Schema } from 'mongoose';
import { TLMU } from './lmutasks.interface';

const lmuSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['whatsapp', 'email', 'calling', 'data-entry', 'others'],
    },
    unit: {
      type: String,
      required: true,
      default: 'LMU',
    },
    task: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LMUTasks = model<TLMU>('LMUTasks', lmuSchema);
