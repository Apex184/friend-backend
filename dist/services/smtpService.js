"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("@/utils/logger"));
class SMTPService {
    constructor(config) {
        this.transporter = nodemailer_1.default.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
        });
    }
    async sendMail(mailOptions) {
        try {
            const result = await this.transporter.sendMail(mailOptions);
            logger_1.default.info('SMTP mail sent successfully', {
                messageId: result.messageId,
                to: mailOptions.to,
                subject: mailOptions.subject,
            });
            return {
                success: true,
                message: 'Mail sent successfully',
                messageId: result.messageId,
            };
        }
        catch (error) {
            logger_1.default.error('SMTP mail sending failed', { error: error instanceof Error ? error.message : error });
            return {
                success: false,
                message: 'Failed to send mail',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            logger_1.default.info('SMTP service connection verified');
            return true;
        }
        catch (error) {
            logger_1.default.error('SMTP service connection failed', { error });
            return false;
        }
    }
}
exports.SMTPService = SMTPService;
//# sourceMappingURL=smtpService.js.map