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
export declare class SMTPService {
    private transporter;
    constructor(config: SMTPConfig);
    sendMail(mailOptions: SMTPMailOptions): Promise<{
        success: boolean;
        message: string;
        messageId?: string;
        error?: string;
    }>;
    verifyConnection(): Promise<boolean>;
}
//# sourceMappingURL=smtpService.d.ts.map