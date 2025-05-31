import { model, Schema } from 'mongoose';
import { TLMU } from './lmu.interface';

const lmuSchema = new Schema(
  {
    unit: {
      type: String,
      required: true,
      enum: ['LMU', 'EMU', 'DSMM', 'HR_FINANCE', 'ALL'],
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
