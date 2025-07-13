import { Types } from 'mongoose';

export type THRFinanceTask = {
  title: string;
  unit: string;
  details: string;
  assignedTo: Types.ObjectId;
  dueDate: Date;
  createdBy: Types.ObjectId;
  status: 'in-progress' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
};
