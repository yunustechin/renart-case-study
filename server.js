const dotenv = require('dotenv');
dotenv.config();

const app = require('./api/app');
const logger = require('./utils/logger'); 

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

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

const unexpectedErrorHandler = (error) => {
  logger.error('Unhandled Error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  exitHandler();
});
