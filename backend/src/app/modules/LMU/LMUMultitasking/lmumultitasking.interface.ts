import { Types } from 'mongoose';

export type TLMUMultitasking = {
  title: string;
  manpower: [
    {
      userId: Types.ObjectId;
    },
  ];
  createdBy: Types.ObjectId;
  status: 'active' | 'inactive';
};
