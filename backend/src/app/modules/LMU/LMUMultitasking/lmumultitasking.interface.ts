import { Types } from 'mongoose';

export type TLMUMultitasking = {
  title: string;
  type: 'whatsapp' | 'calling' | 'email' | 'data-entry' | 'others';
  manpower: {
    userId: Types.ObjectId;
  }[];

  createdBy: Types.ObjectId;
  status: 'active' | 'inactive';
};
