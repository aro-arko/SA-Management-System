export interface IUser {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

type TTask = {
  taskId: string;
  unit: "LMU" | "EMU" | "DSMM" | "HR_FINANCE" | "ALL";
  type: string;
  category: string;
};

export type TUserDetails = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  unit: string;
  role: string;
  phone: string;
  dob: Date;
  status: string;
  tasks?: TTask[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type TCreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  unit: string;
  role: string;
  phone: string;
  dob: Date;
  status: string;
  tasks?: TTask[];
  createdAt?: Date;
  updatedAt?: Date;
};
