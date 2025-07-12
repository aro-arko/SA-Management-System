import { z } from 'zod';

const createDSMMMultitaskingValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    taskDate: z
      .string({ invalid_type_error: 'Date of task must be a string' })
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
const updateDSMMMultitaskingValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    taskDate: z
      .string({ invalid_type_error: 'Date of task must be a string' })
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

export const DSMMMultitaskingValidation = {
  createDSMMMultitaskingValidationSchema,
  updateDSMMMultitaskingValidationSchema,
};
