import { Types } from 'mongoose';

type TActivity = {
  completedLeads: number;
  flaggedLeads: number;
  message: string;
};

export type TGoal = {
  title: string;
  type: 'whatsapp' | 'email' | 'calling';
  completed: number;
  remaining: number;
  total: number;
};

export type TLeadsTask = {
  title: string;
  unit: string;
  type: 'whatsapp' | 'email' | 'calling';
  goalId: Types.ObjectId;
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
