import { MongoServerError } from 'mongodb';
import { TGenericErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleDuplicateError = (err: MongoServerError): TGenericErrorResponse => {
  const statusCode = 409;

  return {
    statusCode,
    message: 'Duplicate key error occurred',
  };
};

export default handleDuplicateError;
