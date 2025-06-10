import { z } from 'zod';

const createLMUMultitaskingValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['whatsapp', 'calling', 'email', 'data-entry', 'others']),
  }),
});

const updateLMUMultitaskingValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    type: z
      .enum(['whatsapp', 'calling', 'email', 'data-entry', 'others'])
      .optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const LMUMultitaskingValidation = {
  createLMUMultitaskingValidation,
  updateLMUMultitaskingValidation,
};
