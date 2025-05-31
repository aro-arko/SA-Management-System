import { z } from 'zod';
import { USER_ROLE } from './user.constant';

const userUpdateValidation = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: 'Email must be a string' })
      .email({ message: 'Invalid email format' }),

    body: z
      .object({
        firstName: z
          .string({ invalid_type_error: 'First name must be a string' })
          .min(1, { message: 'First name is required' })
          .optional(),

        lastName: z
          .string({ invalid_type_error: 'Last name must be a string' })
          .min(1, { message: 'Last name is required' })
          .optional(),

        password: z
          .string({ invalid_type_error: 'Password must be a string' })
          .min(6, { message: 'Password must be at least 6 characters long' })
          .max(100, { message: 'Password must be at most 32 characters long' })
          .optional(),

        unit: z
          .enum(['LMU', 'EMU', 'DSMM', 'HR_FINANCE', 'ALL'], {
            invalid_type_error:
              'Unit must be one of LMU, EMU, DSMM, HR_FINANCE, ALL',
          })
          .optional(),

        role: z
          .enum(Object.values(USER_ROLE) as [string, ...string[]])
          .optional(),

        phone: z
          .string({ invalid_type_error: 'Phone must be a string' })
          .min(10, {
            message: 'Phone number must be at least 10 characters long',
          })
          .optional(),

        dob: z
          .string({ invalid_type_error: 'Date of birth must be a string' })
          .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date format',
          })
          .optional(),
      })
      .partial(),
  }),

  cookies: z.any().optional(),
});

export const UserValidation = {
  userUpdateValidation,
};
