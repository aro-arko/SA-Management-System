import { z } from 'zod';

const createHrFinanceTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    unit: z.string().min(1, 'Unit is required').default('HR_FINANCE'),
    details: z.string().min(1, 'Details are required'),
    assignedTo: z.string().min(1, 'Assigned user ID is required'),
    dueDate: z
      .string({ invalid_type_error: 'Due date must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
  }),
});

export const hrFinanceTaskValidation = {
  createHrFinanceTaskValidationSchema,
};
