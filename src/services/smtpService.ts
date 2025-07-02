import nodemailer from 'nodemailer';
import logger from '@/utils/logger';

export interface SMTPConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export interface SMTPMailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        path: string;
        contentType?: string;
    }>;
}

export class SMTPService {
    private transporter: nodemailer.Transporter;

    constructor(config: SMTPConfig) {
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        });
    }

    async sendMail(mailOptions: SMTPMailOptions): Promise<{ success: boolean; message: string; messageId?: string; error?: string }> {
        try {
            const result = await this.transporter.sendMail(mailOptions);
            logger.info('SMTP mail sent successfully', {
                messageId: result.messageId,
                to: mailOptions.to,
                subject: mailOptions.subject,
            });
            return {
                success: true,
                message: 'Mail sent successfully',
                messageId: result.messageId,
            };
        } catch (error) {
            logger.error('SMTP mail sending failed', { error: error instanceof Error ? error.message : error });
            return {
                success: false,
                message: 'Failed to send mail',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            logger.info('SMTP service connection verified');
            return true;
        } catch (error) {
            logger.error('SMTP service connection failed', { error });
            return false;
        }
    }
} 