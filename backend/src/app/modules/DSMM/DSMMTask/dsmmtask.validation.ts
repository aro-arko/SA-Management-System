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

const updateDSMMTaskValidationSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, 'Title is required').optional(),
      details: z.string().optional(),
      multiTask: z.boolean().optional(),
      multiTaskId: z.string().optional(),
      selectedManpower: z
        .array(z.string())
        .min(1, 'At least one manpower must be selected'),
    })
    .optional(),
});

export const DSMMTaskValidation = {
  createDSMMTask: createDSMMTaskValidationSchema,
  updateDSMMTask: updateDSMMTaskValidationSchema,
};
