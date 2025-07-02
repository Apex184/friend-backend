"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileUpload = exports.validateEmailRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const emailSchema = joi_1.default.object({
    to: joi_1.default.string().email().required(),
    subject: joi_1.default.string().min(1).max(200).required(),
    text: joi_1.default.string().max(5000).optional(),
    html: joi_1.default.string().max(10000).optional(),
    documentType: joi_1.default.string().max(50).default('FSTF2'),
    cc: joi_1.default.array().items(joi_1.default.string().email()).optional(),
    bcc: joi_1.default.array().items(joi_1.default.string().email()).optional(),
});
const validateEmailRequest = (req, res, next) => {
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
exports.validateEmailRequest = validateEmailRequest;
const validateFileUpload = (req, res, next) => {
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
exports.validateFileUpload = validateFileUpload;
//# sourceMappingURL=validation.js.map