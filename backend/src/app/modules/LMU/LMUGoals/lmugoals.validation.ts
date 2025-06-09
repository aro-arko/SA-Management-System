import { z } from 'zod';

const createLmuGoalValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['whatsapp', 'email', 'calling'], {
      errorMap: () => ({
        message: 'Type must be one of whatsapp, email, or calling',
      }),
    }),
  }),
});

const updateLmuGoalValidation = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['whatsapp', 'email', 'calling'], {
      errorMap: () => ({
        message: 'Type must be one of whatsapp, email, or calling',
      }),
    }),
  }),
});

export const LMUGoalsValidation = {
  createLmuGoalValidation,
  updateLmuGoalValidation,
};
