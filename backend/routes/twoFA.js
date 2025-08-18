
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate2FACode } = require('../middleware/validation');
const { pool } = require('../config/database');
const TwoFactorAuthService = require('../services/twoFactorAuth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Setup 2FA
router.post('/setup', authenticateToken, async (req, res) => {
    try {
        const { method } = req.body; // 'sms', 'email', or 'totp'
        const userId = req.user.id;

        if (method === 'totp') {
            const secret = TwoFactorAuthService.generateTOTPSecret(req.user.email);
            const qrCode = await TwoFactorAuthService.generateQRCode(secret);

            // Store secret temporarily (user needs to verify before enabling)
            await pool.execute(`
                INSERT INTO user_2fa (id, user_id, secret_key, method, is_enabled)
                VALUES (?, ?, ?, 'totp', FALSE)
                ON DUPLICATE KEY UPDATE secret_key = ?, method = 'totp', is_enabled = FALSE
            `, [uuidv4(), userId, secret.base32, secret.base32]);

            res.json({
                status: 'success',
                data: {
                    secret: secret.base32,
                    qrCode,
                    backupCodes: [] // Generate backup codes after verification
                }
            });
        } else {
            // For SMS/Email, send verification code
            const code = TwoFactorAuthService.generateVerificationCode();
            
            if (method === 'sms') {
                await TwoFactorAuthService.sendSMSCode(req.user.phone, code);
            } else if (method === 'email') {
                await TwoFactorAuthService.sendEmailCode(req.user.email, code, req.user.name);
            }

            TwoFactorAuthService.storeCode(req.user.id, code, method);

            res.json({
                status: 'success',
                message: `Verification code sent via ${method}`
            });
        }
    } catch (error) {
        console.error('2FA setup error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to setup 2FA'
        });
    }
});

// Verify 2FA setup
router.post('/verify-setup', authenticateToken, validate2FACode, async (req, res) => {
    try {
        const { code, type } = req.body;
        const userId = req.user.id;

        let isValid = false;

        if (type === 'totp') {
            const [rows] = await pool.execute(
                'SELECT secret_key FROM user_2fa WHERE user_id = ? AND method = "totp"',
                [userId]
            );

            if (rows.length > 0) {
                isValid = TwoFactorAuthService.verifyTOTP(code, rows[0].secret_key);
            }
        } else {
            isValid = TwoFactorAuthService.verifyCode(userId, code, type);
        }

        if (isValid) {
            // Enable 2FA
            await pool.execute(
                'UPDATE user_2fa SET is_enabled = TRUE WHERE user_id = ? AND method = ?',
                [userId, type]
            );

            res.json({
                status: 'success',
                message: '2FA enabled successfully'
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Invalid verification code'
            });
        }
    } catch (error) {
        console.error('2FA verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to verify 2FA'
        });
    }
});

// Disable 2FA
router.post('/disable', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        await pool.execute(
            'UPDATE user_2fa SET is_enabled = FALSE WHERE user_id = ?',
            [userId]
        );

        res.json({
            status: 'success',
            message: '2FA disabled successfully'
        });
    } catch (error) {
        console.error('2FA disable error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to disable 2FA'
        });
    }
});

// Get 2FA status
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT method, is_enabled FROM user_2fa WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            status: 'success',
            data: {
                enabled: rows.length > 0 && rows[0].is_enabled,
                method: rows.length > 0 ? rows[0].method : null
            }
        });
    } catch (error) {
        console.error('2FA status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get 2FA status'
        });
    }
});

module.exports = router;
