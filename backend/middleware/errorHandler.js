export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.code === 'ENOTFOUND') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.response?.status) {
    statusCode = err.response.status;
    message = err.response.data?.message || err.message;
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path
    }
  });
}; 