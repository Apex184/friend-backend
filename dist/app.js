"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("@/config");
const emailRoute_1 = __importDefault(require("./routes/emailRoute"));
const signupLinkRoute_1 = __importDefault(require("./routes/signupLinkRoute"));
const errorHandler_1 = require("@/middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.nodeEnv === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', emailRoute_1.default);
app.use('/api', signupLinkRoute_1.default);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Email Attachment API',
        version: '1.0.0',
        endpoints: {
            sendEmail: 'POST /api/email/send-attachment',
            formatFilename: 'POST /api/email/format-filename',
            health: 'GET /api/email/health',
        },
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map