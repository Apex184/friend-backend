"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const smtpService_1 = require("@/services/smtpService");
const smtpConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your@email.com',
        pass: 'yourpassword',
    },
};
const smtpService = new smtpService_1.SMTPService(smtpConfig);
const mailOptions = {
    from: 'your@email.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Hello, this is a test email sent via custom SMTP!',
};
async function sendTestEmail() {
    const connectionOk = await smtpService.verifyConnection();
    if (!connectionOk) {
        console.error('SMTP connection failed. Check your configuration.');
        return;
    }
    const result = await smtpService.sendMail(mailOptions);
    if (result.success) {
        console.log('Email sent! Message ID:', result.messageId);
    }
    else {
        console.error('Failed to send email:', result.error);
    }
}
sendTestEmail();
//# sourceMappingURL=sendTestSmtpMail.js.map