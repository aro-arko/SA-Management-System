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

export const EMUMultitaskingValidation = {
  createEMUMultitaskingValidationSchema,
};
