import { z } from 'zod';
import { USER_ROLE } from '../User/user.constant';

const registerValidation = z.object({
  body: z.object({
    firstName: z
      .string({
        invalid_type_error: 'First name must be a string',
      })
      .min(1, {
        message: 'First name is required',
      }),
    lastName: z
      .string({
        invalid_type_error: 'Last name must be a string',
      })
      .min(1, {
        message: 'Last name is required',
      }),

    email: z
      .string({
        invalid_type_error: 'Email must be a string',
      })
      .email({
        message: 'Invalid email format',
      }),

    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(100, {
        message: 'Password must be at most 32 characters long',
      }),
    unit: z.enum(['LMU', 'EMU', 'DSMM', 'HR_FINANCE', 'ALL'], {
      required_error: 'Unit is required',
      invalid_type_error: 'Unit must be one of LMU, EMU, DSMM, HR_FINANCE, ALL',
    }),
    role: z.enum(Object.values(USER_ROLE) as [string, ...string[]]),
    phone: z
      .string({
        invalid_type_error: 'Phone must be a string',
      })
      .min(10, {
        message: 'Phone number must be at least 10 characters long',
      }),

    dob: z
      .string({
        invalid_type_error: 'Date of birth must be a string',
      })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: 'Email must be a string',
      })
      .email({
        message: 'Invalid email format',
      }),
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(100, {
        message: 'Password must be at most 32 characters long',
      }),
  }),
});

export const authValidation = {
  registerValidation,
  loginValidation,
};
