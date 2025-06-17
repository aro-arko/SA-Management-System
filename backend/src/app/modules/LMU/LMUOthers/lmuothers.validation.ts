import { z } from 'zod';

const CreateLMUOthersTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    details: z.string().min(1, 'Details are required'),
    multiTask: z.boolean().optional(),
    multiTaskId: z.string().optional(),
    assignedTo: z.array(z.string()).optional(),
  }),
});

export const LMUOthersValidation = {
  CreateLMUOthersTaskValidationSchema,
};
