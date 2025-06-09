import { model, Schema } from 'mongoose';
import { TGoal } from './leads.interface';

const lmuGoalSchema = new Schema<TGoal>({
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
});

export const LMUGoalModel = model<TGoal>('LMUGoal', lmuGoalSchema);
