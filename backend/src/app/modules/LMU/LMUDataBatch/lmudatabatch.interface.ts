import { Types } from 'mongoose';

export type TLMUDataBatch = {
  title: string;
  type: string; // 'data-entry'
  assignedSets: number;
  submittedSets: number;
  completedSets: number;
  expectedTotalLeads: number;
  completedLeads: number;
  tasks: Types.ObjectId[];
  isActive: boolean;
  createdBy: Types.ObjectId;
};
