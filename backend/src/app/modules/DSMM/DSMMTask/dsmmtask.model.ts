import { model, Schema } from 'mongoose';
import { TDSMMTask } from './dsmmtask.interface';

const DSMMTaskSchema = new Schema<TDSMMTask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      default: 'DSMM',
      required: true,
    },
    details: {
      type: String,
    },
    multiTask: {
      type: Boolean,
      required: true,
    },
    multiTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'DSMMMultitasking',
    },
    selectedManpower: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const DSMMTask = model<TDSMMTask>('DSMMTask', DSMMTaskSchema);
