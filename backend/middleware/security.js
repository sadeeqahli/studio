
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Rate limiting for sensitive endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const paymentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 payment requests per minute
    message: 'Too many payment requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Input sanitization
function sanitizeInput(req, res, next) {
    // Remove potential XSS characters
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                obj[key] = obj[key].replace(/javascript:/gi, '');
                obj[key] = obj[key].replace(/on\w+\s*=/gi, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    
    next();
}

// SQL injection protection (additional layer)
function validateNoSQLInjection(req, res, next) {
    const checkSQLInjection = (value) => {
        if (typeof value === 'string') {
            const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
            return sqlInjectionPattern.test(value);
        }
        return false;
    };

    const checkObject = (obj) => {
        for (let key in obj) {
            if (checkSQLInjection(obj[key])) {
                return true;
            }
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (checkObject(obj[key])) return true;
            }
        }
        return false;
    };

    if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
        return res.status(400).json({ error: 'Invalid input detected' });
    }

    next();
}

module.exports = {
    encrypt,
    decrypt,
    authLimiter,
    paymentLimiter,
    sanitizeInput,
    validateNoSQLInjection
};
