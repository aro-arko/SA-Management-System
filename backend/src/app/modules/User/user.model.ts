import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    unit: {
      type: String,
      enum: ['LMU', 'EMU', 'DSMM', 'HR_FINANCE'],
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      required: true,
    },
    tasks: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

export const User = model<TUser>('User', userSchema);
