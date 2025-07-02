import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import emailRoutes from './routes/emailRoute';
import signupLinkRoutes from './routes/signupLinkRoute';
import { errorHandler } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

const app = express();


app.use(helmet());
app.use(cors({
    origin: config.nodeEnv === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});

app.use(limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', emailRoutes);
app.use('/api', signupLinkRoutes);

// Root endpoint
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

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handling middleware
app.use(errorHandler);

export default app;

