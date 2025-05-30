import { MongoServerError } from 'mongodb';

const handleDuplicateError = (err: MongoServerError) => {
  const statusCode = 409;

  return {
    statusCode,
    message: 'Duplicate key error occurred',
  };
};

export default handleDuplicateError;
