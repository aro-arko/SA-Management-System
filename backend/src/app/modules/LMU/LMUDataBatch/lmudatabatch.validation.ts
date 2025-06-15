import { z } from 'zod';

const LMUDataBatchCreateValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    type: z.literal('data-entry').optional().default('data-entry'),
  }),
});

export const LMUDataBatchValidation = {
  createDataBatch: LMUDataBatchCreateValidationSchema,
};
