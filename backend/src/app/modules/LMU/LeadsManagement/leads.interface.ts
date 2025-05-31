import { Types } from 'mongoose';

type TActivity = {
  completedLeads: number;
  flaggedLeads: number;
  message: string;
};

export type TLeadsTask = {
  title: string;
  unit: string;
  type: 'whatsapp' | 'email' | 'calling';
  multiTask: boolean;
  multiTaskId?: Types.ObjectId;
  assignedTo: Types.ObjectId;
  createdBy: Types.ObjectId;
  dueDate: Date;
  totalLeads: number;
  remainingLeads: number;
  message: string;
  activities: TActivity[];
  completedAt?: Date;
  status: 'in-progress' | 'completed';
};
