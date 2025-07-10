import { z } from 'zod';

const signOutDataCreateValidationSchema = z.object({
  body: z.object({
    taskId: z.string({
      required_error: 'Task ID is required',
    }),
  }),
});

// signin for attendance
const signOutAttendanceValidationSchema = z.object({
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

export const SignOutDataValidation = {
  signOutDataCreateValidationSchema,
  signOutAttendanceValidationSchema,
};
