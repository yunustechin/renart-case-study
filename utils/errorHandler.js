import logger from './logger.js'; 

/**
 * Centralized Express error handling middleware.
 * Logs the error and sends a structured, user-friendly JSON response.
 * @param {Error} err - The error object. Should have `statusCode` and `message` properties.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    statusCode: err.statusCode,
    path: req.path,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export default errorHandler;