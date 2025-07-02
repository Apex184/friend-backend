import { Router, Request, Response } from 'express';
import { EmailService } from '@/services/emailService';
import { upload } from '@/middleware/upload';
import { validateEmailRequest, validateFileUpload } from '@/middleware/validation';
import { FileUtils } from '../utils';
import { AttachmentInfo } from '@/types';
import logger from '@/utils/logger';

const router = Router();
const emailService = new EmailService();

// Send email with attachment
router.post(
    '/send-attachment',
    upload.single('attachment'),
    validateFileUpload,
    validateEmailRequest,
    async (req: Request, res: Response) => {
        try {
            const file = req.file!;
            const emailData = req.body;

            // Create attachment info
            const attachmentInfo: AttachmentInfo = {
                originalName: file.originalname,
                formattedName: FileUtils.generateFormattedFilename(
                    file.originalname,
                    emailData.documentType
                ),
                size: file.size,
                mimeType: file.mimetype,
                path: file.path,
            };

            // Send email
            const result = await emailService.sendEmailWithAttachment(emailData, attachmentInfo);

            // Clean up uploaded file
            FileUtils.cleanupFile(file.path);

            if (result.success) {
                logger.info('Email sent successfully', {
                    to: emailData.to,
                    filename: attachmentInfo.formattedName,
                });

                return res.json({
                    success: true,
                    message: 'Email sent successfully',
                    details: {
                        messageId: result.messageId,
                        formattedFilename: result.formattedFilename,
                        fileSize: result.fileSize,
                        originalFilename: file.originalname,
                    },
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    error: result.error,
                });
            }
        } catch (error) {
            // Clean up file on error
            if (req.file) {
                FileUtils.cleanupFile(req.file.path);
            }

            logger.error('Email route error', { error });
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
);

// Format filename only (without sending email)
router.post('/format-filename', (req: Request, res: Response) => {
    try {
        const { originalFilename, documentType } = req.body;

        if (!originalFilename) {
            return res.status(400).json({
                success: false,
                message: 'Original filename is required',
            });
        }

        const formattedFilename = FileUtils.generateFormattedFilename(
            originalFilename,
            documentType
        );

        return res.json({
            success: true,
            originalFilename,
            formattedFilename,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        logger.error('Format filename error', { error });
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Health check
router.get('/health', async (req: Request, res: Response) => {
    try {
        const emailConnectionOk = await emailService.verifyConnection();

        return res.json({
            success: true,
            status: 'healthy',
            services: {
                email: emailConnectionOk ? 'connected' : 'disconnected',
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;