import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const emailSchema = Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().min(1).max(200).required(),
    text: Joi.string().max(5000).optional(),
    html: Joi.string().max(10000).optional(),
    documentType: Joi.string().max(50).default('FSTF2'),
    cc: Joi.array().items(Joi.string().email()).optional(),
    bcc: Joi.array().items(Joi.string().email()).optional(),
});

export const validateEmailRequest = (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = emailSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: error.details.map(detail => detail.message),
        });
    }

    req.body = value;
    return next();
};

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
        });
    }

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: 'File type not allowed',
            allowedTypes: allowedMimeTypes,
        });
    }

    return next();
};
