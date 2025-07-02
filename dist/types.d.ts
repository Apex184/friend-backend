export interface EmailAttachmentRequest {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    documentType?: string;
    cc?: string[];
    bcc?: string[];
}
export interface AttachmentInfo {
    originalName: string;
    formattedName: string;
    size: number;
    mimeType: string;
    path: string;
}
export interface EmailResponse {
    success: boolean;
    messageId?: string;
    formattedFilename?: string;
    fileSize?: string;
    message: string;
    error?: string;
}
export interface FileStats {
    size: number;
    pages?: number;
    extension: string;
}
export interface AppConfig {
    port: number;
    nodeEnv: string;
    email: {
        service: string;
        user: string;
        pass: string;
    };
    upload: {
        maxFileSize: number;
        allowedMimeTypes: string[];
    };
}
//# sourceMappingURL=types.d.ts.map