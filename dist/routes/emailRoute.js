"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailService_1 = require("@/services/emailService");
const upload_1 = require("@/middleware/upload");
const validation_1 = require("@/middleware/validation");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("@/utils/logger"));
const router = (0, express_1.Router)();
const emailService = new emailService_1.EmailService();
router.post('/send-attachment', upload_1.upload.single('attachment'), validation_1.validateFileUpload, validation_1.validateEmailRequest, async (req, res) => {
    try {
        const file = req.file;
        const emailData = req.body;
        const attachmentInfo = {
            originalName: file.originalname,
            formattedName: utils_1.FileUtils.generateFormattedFilename(file.originalname, emailData.documentType),
            size: file.size,
            mimeType: file.mimetype,
            path: file.path,
        };
        const result = await emailService.sendEmailWithAttachment(emailData, attachmentInfo);
        utils_1.FileUtils.cleanupFile(file.path);
        if (result.success) {
            logger_1.default.info('Email sent successfully', {
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
        }
        else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error,
            });
        }
    }
    catch (error) {
        if (req.file) {
            utils_1.FileUtils.cleanupFile(req.file.path);
        }
        logger_1.default.error('Email route error', { error });
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/format-filename', (req, res) => {
    try {
        const { originalFilename, documentType } = req.body;
        if (!originalFilename) {
            return res.status(400).json({
                success: false,
                message: 'Original filename is required',
            });
        }
        const formattedFilename = utils_1.FileUtils.generateFormattedFilename(originalFilename, documentType);
        return res.json({
            success: true,
            originalFilename,
            formattedFilename,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger_1.default.error('Format filename error', { error });
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/health', async (req, res) => {
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
    }
    catch (error) {
        return res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=emailRoute.js.map