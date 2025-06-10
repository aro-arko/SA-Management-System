import { Types } from 'mongoose';

export type TGoal = {
  title: string;
  type: 'whatsapp' | 'email' | 'calling';
  completed: number;
  remaining: number;
  total: number;
  isActive: boolean;
  createdBy: Types.ObjectId;
};
