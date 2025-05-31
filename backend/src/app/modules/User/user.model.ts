import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    unit: {
      type: String,
      enum: ['LMU', 'EMU', 'DSMM', 'HR_FINANCE', 'ALL'],
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
    phone: { type: String, unique: true, required: true },
    dob: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
    tasks: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

// Middleware to update the updatedAt field before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// Middleware to update the updatedAt field before updating
userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && !Array.isArray(update)) {
    if (update.password) {
      const hashed = await bcrypt.hash(
        update.password,
        Number(config.bcrypt_salt_rounds),
      );
      update.password = hashed;
    }
  }
  next();
});

// Static method to check if the password is correct
userSchema.statics.isPasswordMatched = async function (
  plainTextPassowrd,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassowrd, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
