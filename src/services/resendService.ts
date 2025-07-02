import axios from 'axios';
import logger from '@/utils/logger';

export interface ResendConfig {
    apiKey: string;
}

export interface ResendMailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        content: string; // base64 encoded
        type?: string;
    }>;
}

export class ResendService {
    private apiKey: string;
    private apiUrl = 'https://api.resend.com/emails';

    constructor(config: ResendConfig) {
        this.apiKey = config.apiKey;
    }

    async sendMail(mailOptions: ResendMailOptions): Promise<{ success: boolean; message: string; id?: string; error?: string }> {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    from: mailOptions.from,
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                    text: mailOptions.text,
                    html: mailOptions.html,
                    cc: mailOptions.cc,
                    bcc: mailOptions.bcc,
                    attachments: mailOptions.attachments,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            logger.info('Resend mail sent successfully', {
                id: response.data.id,
                to: mailOptions.to,
                subject: mailOptions.subject,
            });
            return {
                success: true,
                message: 'Mail sent successfully',
                id: response.data.id,
            };
        } catch (error) {
            logger.error('Resend mail sending failed', { error: error instanceof Error ? error.message : error });
            return {
                success: false,
                message: 'Failed to send mail',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
} 