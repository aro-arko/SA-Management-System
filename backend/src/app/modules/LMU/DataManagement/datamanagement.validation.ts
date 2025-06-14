import { z } from 'zod';

const createDataEntryTaskValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    batchId: z.string().optional(),
    multiTask: z.boolean().default(false),
    multiTaskId: z.string().optional(),
    assignedTo: z.string().min(1, 'Data set must be assigned to a user'),
    dueDate: z
      .string({ invalid_type_error: 'Due date must be a string' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      })
      .optional(),
    schoolTeamTotalLeads: z.number().min(1, 'Total leads must be at least 1'),
    campaignId: z.string().min(1, 'Campaign ID is required'),
    highestQualification: z
      .string()
      .min(1, 'Highest qualification is required'),
    preferredProgram: z.string().min(1, 'Preferred program is required'),
    preferredIntake: z.string().min(1, 'Preferred intake is required'),
    schoolLevel: z.string().min(1, 'School level is required'),
    schoolName: z.string().min(1, 'School name is required'),
    message: z.string().optional(),
  }),
});

export const DataManagementValidation = {
  createDataEntryTask: createDataEntryTaskValidationSchema,
};
