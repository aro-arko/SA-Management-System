import { z } from 'zod';

const createEMUMultitaskingValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    eventDate: z
      .string({ invalid_type_error: 'Date of event must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    startTime: z
      .string({ invalid_type_error: 'Start time must be a string' })
      .refine((time) => !isNaN(Date.parse(time)), {
        message: 'Invalid start time format',
      }),
    endTime: z
      .string({ invalid_type_error: 'End time must be a string' })
      .refine((time) => !isNaN(Date.parse(time)), {
        message: 'Invalid end time format',
      }),
  }),
});

// update multitasking validation schema
const updateEMUMultitaskingValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    eventDate: z
      .string({ invalid_type_error: 'Date of event must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
    startTime: z
      .string({ invalid_type_error: 'Start time must be a string' })
      .refine((time) => !isNaN(Date.parse(time)), {
        message: 'Invalid start time format',
      })
      .optional(),
    endTime: z
      .string({ invalid_type_error: 'End time must be a string' })
      .refine((time) => !isNaN(Date.parse(time)), {
        message: 'Invalid end time format',
      })
      .optional(),
  }),
});

// remove someone from multitasking validation schema
const removeFromEMUMultitaskingValidationSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export const EMUMultitaskingValidation = {
  createEMUMultitaskingValidationSchema,
  updateEMUMultitaskingValidationSchema,
  removeFromEMUMultitaskingValidationSchema,
};
