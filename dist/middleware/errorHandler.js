"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("@/utils/logger"));
const config_1 = require("@/config");
const errorHandler = (error, req, res, next) => {
    logger_1.default.error('Application error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });
    if (error.name === 'MulterError') {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File too large',
                maxSize: config_1.config.upload.maxFileSize,
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'File type not allowed',
                allowedTypes: config_1.config.upload.allowedMimeTypes,
            });
        }
    }
    if (error.message && error.message.includes('File too large')) {
        return res.status(413).json({
            success: false,
            message: 'File too large',
            maxSize: config_1.config.upload.maxFileSize,
        });
    }
    if (error.message && error.message.includes('File type not allowed')) {
        return res.status(400).json({
            success: false,
            message: 'File type not allowed',
            allowedTypes: config_1.config.upload.allowedMimeTypes,
        });
    }
    const statusCode = error.statusCode || 500;
    const message = config_1.config.nodeEnv === 'production'
        ? 'Something went wrong'
        : error.message || 'Unknown error';
    return res.status(statusCode).json({
        success: false,
        message,
        ...(config_1.config.nodeEnv !== 'production' && {
            stack: error.stack,
            details: error
        }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map