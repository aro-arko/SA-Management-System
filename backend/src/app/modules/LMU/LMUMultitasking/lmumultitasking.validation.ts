import { z } from 'zod';

const createLMUMultitaskingValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
  }),
});

export const LMUMultitaskingValidation = {
  createLMUMultitaskingValidation,
};
