import { model, Schema } from 'mongoose';
import { TLeadsTask } from './leads.interface';

const leadsTaskSchema = new Schema<TLeadsTask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      enum: ['LMU', 'EMU', 'DSMM', 'HR_FINANCE', 'ALL'],
      required: true,
      default: 'LMU',
    },
    type: {
      type: String,
      enum: ['whatsapp', 'email', 'calling'],
      required: true,
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: 'LMUGoal',
    },
    multiTask: {
      type: Boolean,
      default: false,
      required: true,
    },
    multiTaskId: {
      type: Schema.Types.ObjectId,
      ref: 'LMUMultitask',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    totalLeads: {
      type: Number,
      required: true,
    },
    completedLeads: {
      type: Number,
      required: true,
      default: 0,
    },
    remainingLeads: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    activities: {
      type: [
        {
          completedLeads: { type: Number, required: true },
          flaggedLeads: { type: Number, required: true },
          remarks: { type: String, required: true },
        },
      ],
      default: [],
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LeadsTask = model<TLeadsTask>('LeadsTask', leadsTaskSchema);
