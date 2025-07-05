import dotenv from 'dotenv';
import app from './api/app.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`);
});

/**
 * Handles graceful server shutdown. Closes the server and exits the process.
 */
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/**
 * Handles unexpected errors, logs them, and triggers a graceful shutdown.
 * @param {Error} error - The unhandled error object.
 */
const unexpectedErrorHandler = (error) => {
  logger.error('Unhandled Error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  exitHandler();
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  exitHandler();
});