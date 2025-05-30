import { ZodError } from 'zod';
import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  return {
    statusCode,
    message: 'Zod Error Occurred',
  };
};

export default handleZodError;
