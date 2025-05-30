import { ZodError } from 'zod';

const handleZodError = (err: ZodError) => {
  const statusCode = 400;
  return {
    statusCode,
    message: 'Zod Error Occurred',
  };
};

export default handleZodError;
