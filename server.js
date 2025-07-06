console.log('[DEBUG] server.js execution started.');

try {
  console.log('[DEBUG] Importing dotenv...');
  const dotenv = (await import('dotenv')).default;
  console.log('[DEBUG] dotenv imported successfully.');

  console.log('[DEBUG] Importing logger...');
  const logger = (await import('./utils/logger.js')).default;
  console.log('[DEBUG] logger imported successfully.');

  console.log('[DEBUG] Importing app from ./api/app.js...');
  const app = (await import('./api/app.js')).default;
  console.log('[DEBUG] app imported successfully.');

  console.log('[DEBUG] Configuring dotenv...');
  dotenv.config();
  console.log('[DEBUG] dotenv configured.');

  const PORT = process.env.PORT || 5000;

  console.log(`[DEBUG] Attempting to listen on PORT: ${PORT}`);
  const server = app.listen(PORT, () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
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

} catch (error) {
  console.error('[FATAL CRASH] A critical error occurred during server startup:');
  console.error(error);
  process.exit(1); 
}