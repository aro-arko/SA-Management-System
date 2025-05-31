import { Types } from 'mongoose';

export type TLMU = {
  title: string;
  type: 'whatsapp' | 'email' | 'calling';
  unit: string;
  tasks: Types.ObjectId[];
};
