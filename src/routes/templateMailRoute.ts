import { Router, Request, Response } from 'express';
import { EmailService } from '@/services/emailService';
import { generateEmailTemplate } from '@/utils/emailTemplates';

const router = Router();
const emailService = new EmailService();

router.post('/template-mail', async (req: Request, res: Response) => {
    try {
        const {
            to,
            senderName,
            senderTitle,
            senderDepartment,
            companyName,
            senderEmail,
            message,
            subject,
            date,
            disclaimer,
            address,
            fax,
            contactEmail,
            copyright
        } = req.body;

        if (!to || !senderName || !senderTitle || !companyName || !senderEmail || !subject || !date || !disclaimer || !address || !fax || !contactEmail || !copyright) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const html = generateEmailTemplate({
            senderName,
            senderTitle,
            senderDepartment: senderDepartment || '',
            companyName,
            senderEmail,
            message: message || '',
            subject,
            date,
            disclaimer,
            address,
            fax,
            contactEmail,
            copyright
        });

        const result = await emailService.sendEmailWithAttachment(
            { to, subject, html },
            {
                originalName: '',
                formattedName: '',
                size: 0,
                mimeType: '',
                path: '',
            }
        );

        if (result.success) {
            return res.json({ success: true, message: 'Template email sent' });
        } else {
            return res.status(500).json({ success: false, message: result.message, error: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router; 