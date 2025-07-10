import { Types } from 'mongoose';

export type TDSMMTask = {
  title: string;
  unit: string;
  details: string;
  multiTask: boolean;
  multiTaskId: string;
  selectedManpower: Types.ObjectId[];
  status: 'completed' | 'in-progress';
};
