const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    statusCode: err.statusCode,
    stack: err.stack
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;