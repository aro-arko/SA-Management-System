import { USER_ROLE } from './user.constant';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  unit: 'LMU' | 'EMU' | 'DSMM' | 'HR_FINANCE';
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  phone: string;
  dob: Date;
  status: 'active' | 'inactive';
  tasks?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
