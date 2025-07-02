import nodemailer from 'nodemailer';
import { config } from '@/config';
import { EmailAttachmentRequest, EmailResponse, AttachmentInfo } from '@/types';
import { FileUtils } from '../utils';
import logger from '@/utils/logger';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.email.service,
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }

    async sendEmailWithAttachment(
        emailData: EmailAttachmentRequest,
        attachmentInfo: AttachmentInfo
    ): Promise<EmailResponse> {
        try {
            const { to, subject, text, html, cc, bcc } = emailData;

            const fileStats = FileUtils.getFileStats(attachmentInfo.path);
            const formattedSize = FileUtils.formatFileSize(fileStats.size);

            const mailOptions: nodemailer.SendMailOptions = {
                from: config.email.user,
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

            logger.info('Email sent successfully', {
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
        } catch (error) {
            logger.error('Email sending failed', { error: error instanceof Error ? error.message : error });

            return {
                success: false,
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            logger.info('Email service connection verified');
            return true;
        } catch (error) {
            logger.error('Email service connection failed', { error });
            return false;
        }
    }
}
