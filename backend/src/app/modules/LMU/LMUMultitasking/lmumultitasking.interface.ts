import { Types } from 'mongoose';

export type TLMUMultitasking = {
  title: string;
  manpower: [
    {
      userId: Types.ObjectId;
    },
  ];
  status: 'active' | 'inactive';
};
