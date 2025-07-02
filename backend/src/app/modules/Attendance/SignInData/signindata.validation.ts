import { z } from 'zod';

const signInDataCreateValidationSchema = z.object({
  body: z.object({
    taskId: z.string({
      required_error: 'Task ID is required',
    }),
  }),
});

export const SignInDataValidation = {
  signInDataCreateValidationSchema,
};
