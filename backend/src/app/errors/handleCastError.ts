import { CastError } from 'mongoose';

const handleCastError = (err: CastError) => {
  const statusCode = 400;

  return {
    statusCode,
    message: `Invalid value '${err.value}' for field '${err.path}'`,
  };
};

export default handleCastError;
