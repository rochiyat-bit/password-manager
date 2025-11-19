import app from './app';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initializeJobs } from './jobs';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis
    await connectRedis();

    // Initialize background jobs
    await initializeJobs();

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();
