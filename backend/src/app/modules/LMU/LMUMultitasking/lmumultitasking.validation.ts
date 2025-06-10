import { z } from 'zod';

const createLMUMultitaskingValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['whatsapp', 'calling', 'email', 'data-entry', 'others']),
  }),
});

export const LMUMultitaskingValidation = {
  createLMUMultitaskingValidation,
};
