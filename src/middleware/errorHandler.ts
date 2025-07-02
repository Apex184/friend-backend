import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger';
import { config } from '../config';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: string;
}

export const errorHandler = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Application error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    // Multer errors (check error.name for MulterError)
    if (error.name === 'MulterError') {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File too large',
                maxSize: config.upload.maxFileSize,
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'File type not allowed',
                allowedTypes: config.upload.allowedMimeTypes,
            });
        }
    }

    // Fallback for string-based Multer errors or custom errors
    if (error.message && error.message.includes('File too large')) {
        return res.status(413).json({
            success: false,
            message: 'File too large',
            maxSize: config.upload.maxFileSize,
        });
    }

    if (error.message && error.message.includes('File type not allowed')) {
        return res.status(400).json({
            success: false,
            message: 'File type not allowed',
            allowedTypes: config.upload.allowedMimeTypes,
        });
    }

    const statusCode = error.statusCode || 500;
    const message = config.nodeEnv === 'production'
        ? 'Something went wrong'
        : error.message || 'Unknown error';

    return res.status(statusCode).json({
        success: false,
        message,
        ...(config.nodeEnv !== 'production' && {
            stack: error.stack,
            details: error
        }),
    });
};
