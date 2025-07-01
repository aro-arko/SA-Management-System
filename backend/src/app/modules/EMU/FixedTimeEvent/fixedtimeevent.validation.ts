import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createFixedTimeEventValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    multiTask: z.boolean(),
    multiTaskId: z.string().optional(),
    eventDate: z
      .string({ invalid_type_error: 'Event date must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),

    startTime: z
      .string({ invalid_type_error: 'Start time must be a string' })
      .regex(timeRegex, {
        message: 'Time must be in HH:mm format (e.g. 14:30)',
      }),

    endTime: z
      .string({ invalid_type_error: 'End time must be a string' })
      .regex(timeRegex, {
        message: 'Time must be in HH:mm format (e.g. 14:30)',
      }),
  }),
});

export const FixedTimeEventValidationSchema = {
  createFixedTimeEventValidation,
};
