import { z } from 'zod';

const applyNewApplicationValidationSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    studentId: z
      .number()
      .int()
      .positive('Student ID must be a positive integer'),
    expectedGraduationDate: z
      .date()
      .refine(
        (date) => date > new Date(),
        'Expected graduation date must be in the future',
      ),
    email: z.string().email('Invalid email format'),
    phoneNumber: z
      .number()
      .int()
      .positive('Phone number must be a positive integer'),
    Faculty: z.string().min(1, 'Faculty is required'),
    Major: z.string().min(1, 'Major is required'),
    ResumeLink: z.string().url('Resume link must be a valid URL'),
  }),
});

export const NewApplicationValidation = {
  applyNewApplicationValidationSchema,
};
