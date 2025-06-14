import { model, Schema } from 'mongoose';
import { TGoal } from './lmuleadsgoals.interface';

const lmuLeadsGoalSchema = new Schema<TGoal>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['whatsapp', 'email', 'calling'],
      required: true,
    },
    completed: {
      type: Number,
      default: 0,
      required: true,
    },
    remaining: {
      type: Number,
      default: 0,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LeadsTask',
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

export const LMULeadsGoal = model<TGoal>('LMULeadsGoal', lmuLeadsGoalSchema);
