import app from './app';
import { config } from './config';
import logger from '@/utils/logger';
import { FileUtils } from './utils';


FileUtils.ensureDirectoryExists('uploads');
FileUtils.ensureDirectoryExists('logs');

const startServer = async () => {
    try {
        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`, {
                port: config.port,
                nodeEnv: config.nodeEnv,
            });
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
};

startServer();
