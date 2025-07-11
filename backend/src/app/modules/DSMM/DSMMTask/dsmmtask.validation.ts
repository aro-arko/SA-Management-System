import { z } from 'zod';

const createDSMMTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    details: z.string().optional(),
    multiTask: z.boolean(),
    multiTaskId: z.string().optional(),
    selectedManpower: z
      .array(z.string())
      .min(1, 'At least one manpower must be selected'),
  }),
});

export const DSMMTaskValidation = {
  createDSMMTask: createDSMMTaskValidationSchema,
};
