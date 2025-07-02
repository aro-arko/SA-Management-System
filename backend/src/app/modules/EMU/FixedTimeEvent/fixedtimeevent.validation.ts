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

// updateFixedTimeEventValidation schema
const updateFixedTimeEventValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    multiTask: z.boolean().optional(),
    multiTaskId: z.string().optional(),
    eventDate: z
      .string({ invalid_type_error: 'Event date must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),

    startTime: z
      .string({ invalid_type_error: 'Start time must be a string' })
      .regex(timeRegex, {
        message: 'Time must be in HH:mm format (e.g. 14:30)',
      })
      .optional(),

    endTime: z
      .string({ invalid_type_error: 'End time must be a string' })
      .regex(timeRegex, {
        message: 'Time must be in HH:mm format (e.g. 14:30)',
      })
      .optional(),
    selectedManpower: z.array(z.string()).optional(),
  }),
});

export const FixedTimeEventValidationSchema = {
  createFixedTimeEventValidation,
  updateFixedTimeEventValidation,
};
