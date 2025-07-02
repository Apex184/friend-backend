"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smtpService_1 = require("@/services/smtpService");
const router = (0, express_1.Router)();
router.post('/send', async (req, res) => {
    try {
        const { smtpConfig, mailOptions } = req.body;
        if (!smtpConfig || !mailOptions) {
            return res.status(400).json({
                success: false,
                message: 'smtpConfig and mailOptions are required in the request body',
            });
        }
        const smtpService = new smtpService_1.SMTPService(smtpConfig);
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
        }
        else {
            return res.status(500).json({
                success: false,
                message: result.message,
                error: result.error,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=smtpRoute.js.map