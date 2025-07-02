import { Router, Request, Response } from 'express';
import { SMTPService, SMTPConfig, SMTPMailOptions } from '@/services/smtpService';

const router = Router();

router.post('/send', async (req: Request, res: Response) => {
    try {
        const { smtpConfig, mailOptions } = req.body as { smtpConfig: SMTPConfig; mailOptions: SMTPMailOptions };
        if (!smtpConfig || !mailOptions) {
            return res.status(400).json({
                success: false,
                message: 'smtpConfig and mailOptions are required in the request body',
            });
        }
        const smtpService = new SMTPService(smtpConfig);
        const connectionOk = await smtpService.verifyConnection();
        if (!connectionOk) {
            return res.status(500).json({
                success: false,
                message: 'SMTP connection failed. Check your configuration.',
            });
        }
        const result = await smtpService.sendMail(mailOptions);
        if (result.success) {
            return res.json({
                success: true,
                message: 'Email sent successfully',
                messageId: result.messageId,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router; 