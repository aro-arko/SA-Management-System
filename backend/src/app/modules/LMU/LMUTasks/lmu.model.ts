import { model, Schema } from 'mongoose';
import { TLMU } from './lmu.interface';

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
      enum: ['whatsapp', 'email', 'calling'],
    },
    unit: {
      type: String,
      required: true,
      default: 'LMU',
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LMUModel = model<TLMU>('LMU', lmuSchema);
