"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("@/utils/logger"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: config_1.config.email.service,
            auth: {
                user: config_1.config.email.user,
                pass: config_1.config.email.pass,
            },
        });
    }
    async sendEmailWithAttachment(emailData, attachmentInfo) {
        try {
            const { to, subject, text, html, cc, bcc } = emailData;
            const fileStats = utils_1.FileUtils.getFileStats(attachmentInfo.path);
            const formattedSize = utils_1.FileUtils.formatFileSize(fileStats.size);
            const mailOptions = {
                from: config_1.config.email.user,
                to,
                cc,
                bcc,
                subject,
                text: text || 'Please find the attached document.',
                html: html || '<p>Please find the attached document.</p>',
                attachments: [
                    {
                        filename: attachmentInfo.formattedName,
                        path: attachmentInfo.path,
                        contentType: attachmentInfo.mimeType,
                    },
                ],
            };
            const result = await this.transporter.sendMail(mailOptions);
            logger_1.default.info('Email sent successfully', {
                messageId: result.messageId,
                to,
                filename: attachmentInfo.formattedName,
                size: formattedSize,
            });
            return {
                success: true,
                messageId: result.messageId,
                formattedFilename: attachmentInfo.formattedName,
                fileSize: formattedSize,
                message: 'Email sent successfully',
            };
        }
        catch (error) {
            logger_1.default.error('Email sending failed', { error: error instanceof Error ? error.message : error });
            return {
                success: false,
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info('Email service connection verified');
            return true;
        }
        catch (error) {
            logger_1.default.error('Email service connection failed', { error });
            return false;
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=emailService.js.map