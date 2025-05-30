const handleAuthenticationError = (err: Error) => {
  const statusCode = 401;

  return {
    statusCode,
    message: 'Invalid token or expired session',
  };
};

export default handleAuthenticationError;
