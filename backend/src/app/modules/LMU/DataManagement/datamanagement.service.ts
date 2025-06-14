import { Types } from 'mongoose';

export type TDataEntryReport = {
  completedLeads: number;
  flaggedLeads?: number;
  fileLink?: string;
  remarks?: string;
};

export type TDataEntryTask = {
  title: string;
  unit: string;
  type: 'data-entry';
  batchId?: Types.ObjectId;
  multiTask: boolean;
  multiTaskId?: Types.ObjectId;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  dueDate: Date;
  schoolTeamTotalLeads: number;
  campaignId: string; // GZXCMB
  highestQualification: string; // SPM
  preferredProgram: string; // FDBAA
  preferredIntake: string; // Jan 2024
  schoolLevel: string; // Form 5
  schoolName: string;
  totalLeads: number;
  message: string;
  report: TDataEntryReport;
  completedAt?: Date;
  status: 'in-progress' | 'completed';
};
