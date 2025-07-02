"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("@/app"));
const config_1 = require("@/config");
const logger_1 = __importDefault(require("@/utils/logger"));
const utils_1 = require("./utils");
utils_1.FileUtils.ensureDirectoryExists('uploads');
utils_1.FileUtils.ensureDirectoryExists('logs');
const startServer = async () => {
    try {
        const server = app_1.default.listen(config_1.config.port, () => {
            logger_1.default.info(`Server running on port ${config_1.config.port}`, {
                port: config_1.config.port,
                nodeEnv: config_1.config.nodeEnv,
            });
        });
        process.on('SIGTERM', () => {
            logger_1.default.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger_1.default.info('Process terminated');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            logger_1.default.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                logger_1.default.info('Process terminated');
                process.exit(0);
            });
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server', { error });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map