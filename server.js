import app from './api/app.js';
import logger from './utils/logger.js';
import { initializeGoldPriceService } from './api/goldPriceService.js';

const PORT = process.env.PORT || 5000;
logger.info('Initializing gold price background service...');
initializeGoldPriceService();

const server = app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
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

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  exitHandler();
});