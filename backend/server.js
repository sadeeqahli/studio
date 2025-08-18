const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { sanitizeInput, validateNoSQLInjection } = require('./middleware/security');
const { authenticateToken, requireRole } = require('./middleware/auth'); // Assuming auth middleware exists

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const pitchRoutes = require('./routes/pitches');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const rewardRoutes = require('./routes/rewards');
const adminRoutes = require('./routes/admin');
const twoFARoutes = require('./routes/twoFA'); // Assuming twoFA routes are created

// Import services
const APIKeyRotationService = require('./services/apiKeyRotation');
const MonitoringService = require('./services/monitoring');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:9002',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(sanitizeInput);
app.use(validateNoSQLInjection);

// Health check endpoint (original health check is replaced by monitoring service)
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         message: '9ja Pitch Connect API is running',
//         timestamp: new Date().toISOString()
//     });
// });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pitches', pitchRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/2fa', twoFARoutes); // Added 2FA route

// Monitoring and Analytics endpoints
app.get('/api/health', async (req, res) => {
    try {
        const health = await MonitoringService.getSystemHealth();
        res.json(health);
    } catch (error) {
        res.status(500).json({ error: 'Health check failed' });
    }
});

app.get('/api/analytics', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { timeRange } = req.query;
        const analytics = await MonitoringService.getAdvancedAnalytics(timeRange);
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate analytics' });
    }
});

// API monitoring middleware
app.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        const userId = req.user?.id || null; // Assuming user info is attached to req by authenticateToken

        MonitoringService.trackAPIUsage(
            userId,
            req.originalUrl,
            req.method,
            res.statusCode,
            responseTime,
            req.get('User-Agent'),
            req.ip
        ).catch(console.error); // Log errors but don't break the request
    });

    next();
});


// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: 'The requested endpoint does not exist'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);

    const status = error.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message;

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('Failed to connect to database. Exiting...');
            process.exit(1);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
🚀 9ja Pitch Connect API Server Started
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://0.0.0.0:${PORT}
📊 Health Check: http://0.0.0.0:${PORT}/health
⏰ Started at: ${new Date().toISOString()}
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start API key rotation service
APIKeyRotationService.startAutoRotation(); // Added to start the service