import mongoose from 'mongoose';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error Occurred',
  };
};

export default handleValidationError;
