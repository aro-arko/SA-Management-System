import { model, Schema } from 'mongoose';
import { TDataEntryTask } from './datamanagement.interface';

const dataManagementSchema = new Schema({
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
    enum: ['data-entry'],
    default: 'data-entry',
    required: true,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'LMUDataBatch',
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
  schoolTeamTotalLeads: {
    type: Number,
    required: true,
  },
  campaignId: {
    type: String, // GZXCMB
    required: true,
  },
  highestQualification: {
    type: String, // SPM
    required: true,
  },
  preferredProgram: {
    type: String, // FDBAA
    required: true,
  },
  preferredIntake: {
    type: String, // Jan 2024
    required: true,
  },
  schoolLevel: {
    type: String, // Form 5
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  totalLeads: {
    type: Number,
    default: 0,
  },
  message: {
    type: String,
    default: '',
  },
  report: {
    completedLeads: {
      type: Number,
      default: 0,
    },
    flaggedLeads: {
      type: Number,
      default: 0,
    },
    fileLink: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['in-progress', 'in-checking', 'completed'],
    default: 'in-progress',
  },
});

export const DataEntryTask = model<TDataEntryTask>(
  'DataEntryTask',
  dataManagementSchema,
);
