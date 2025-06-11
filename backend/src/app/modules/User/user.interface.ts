import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

type TTask = {
  taskId: Types.ObjectId;
  unit: 'LMU' | 'EMU' | 'DSMM' | 'HR_FINANCE' | 'ALL';
  type: string;
};

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
  tasks?: TTask[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassowrd: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
