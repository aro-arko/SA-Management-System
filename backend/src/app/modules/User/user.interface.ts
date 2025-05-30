import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  unit: 'LMU' | 'EMU' | 'DSMM' | 'HR_FINANCE' | 'ALL';
  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  phone: string;
  dob: Date;
  status: 'active' | 'inactive';
  tasks?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassowrd: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
