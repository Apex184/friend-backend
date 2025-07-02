import { EmailAttachmentRequest, EmailResponse, AttachmentInfo } from '@/types';
export declare class EmailService {
    private transporter;
    constructor();
    sendEmailWithAttachment(emailData: EmailAttachmentRequest, attachmentInfo: AttachmentInfo): Promise<EmailResponse>;
    verifyConnection(): Promise<boolean>;
}
//# sourceMappingURL=emailService.d.ts.map