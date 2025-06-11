import { z } from 'zod';

const leadsCreationValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['whatsapp', 'email', 'calling'], {
      required_error: 'Type is required',
    }),
    goalId: z.string().optional(),
    multiTaskId: z.string().optional(),
    assignedTo: z.string().min(1, 'You must assign the task to a user'),
    totalLeads: z.number().min(1, 'Total leads must be at least 1'),
    dueDate: z
      .string({ invalid_type_error: 'Date of birth must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
    message: z.string().optional(),
  }),
});

export const LeadsManagementValidation = {
  leadsCreationValidationSchema,
};
