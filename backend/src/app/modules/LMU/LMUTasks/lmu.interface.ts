import { Types } from 'mongoose';

export type TLMU = {
  title: string;
  type: 'whatsapp' | 'email' | 'calling' | 'data-entry' | 'others';
  unit: string;
  tasks: Types.ObjectId[];
};
