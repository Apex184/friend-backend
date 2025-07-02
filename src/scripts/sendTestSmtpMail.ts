import { SMTPService, SMTPConfig, SMTPMailOptions } from '@/services/smtpService';

const smtpConfig: SMTPConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your@email.com',
        pass: 'yourpassword',
    },
};

const smtpService = new SMTPService(smtpConfig);

const mailOptions: SMTPMailOptions = {
    from: 'your@email.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    text: 'Hello, this is a test email sent via custom SMTP!',
    // html: '<b>Hello, this is a test email sent via custom SMTP!</b>',
    // attachments: [
    //   {
    //     filename: 'test.txt',
    //     path: '/path/to/test.txt',
    //   },
    // ],
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
    } else {
        console.error('Failed to send email:', result.error);
    }
}

sendTestEmail(); 