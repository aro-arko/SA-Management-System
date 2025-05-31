import { Types } from 'mongoose';

export type TLMU = {
  unit: string;
  tasks: Types.ObjectId[];
};
