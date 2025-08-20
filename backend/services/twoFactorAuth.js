
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Initialize services
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    throw new Error('Invalid or missing TWILIO_ACCOUNT_SID in environment variables');
}

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class TwoFactorAuthService {
    // Generate TOTP secret for authenticator apps
    static generateTOTPSecret(userEmail) {
        return speakeasy.generateSecret({
            name: `9ja Pitch Connect (${userEmail})`,
            issuer: '9ja Pitch Connect',
            length: 32
        });
    }

    // Generate QR code for TOTP setup
    static async generateQRCode(secret) {
        try {
            return await QRCode.toDataURL(secret.otpauth_url);
        } catch (error) {
            throw new Error('Failed to generate QR code');
        }
    }

    // Verify TOTP code
    static verifyTOTP(token, secret) {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2
        });
    }

    // Generate 6-digit SMS/Email code
    static generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send SMS verification code
    static async sendSMSCode(phoneNumber, code) {
        try {
            await twilioClient.messages.create({
                body: `Your 9ja Pitch Connect verification code is: ${code}. Valid for 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            return true;
        } catch (error) {
            console.error('SMS sending error:', error);
            throw new Error('Failed to send SMS verification code');
        }
    }

    // Send email verification code
    static async sendEmailCode(email, code, name) {
        try {
            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: '9ja Pitch Connect - Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Verification Code</h2>
                        <p>Hello ${name},</p>
                        <p>Your verification code is:</p>
                        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>This code will expire in 5 minutes.</p>
                        <p>If you didn't request this code, please ignore this email.</p>
                        <p>Best regards,<br>9ja Pitch Connect Team</p>
                    </div>
                `
            };
            await sgMail.send(msg);
            return true;
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email verification code');
        }
    }

    // Store verification code in cache (using memory cache for demo)
    static verificationCodes = new Map();

    static storeCode(identifier, code, type) {
        const key = `${type}_${identifier}`;
        this.verificationCodes.set(key, {
            code,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        });
    }

    static verifyCode(identifier, code, type) {
        const key = `${type}_${identifier}`;
        const stored = this.verificationCodes.get(key);
        
        if (!stored || Date.now() > stored.expires) {
            this.verificationCodes.delete(key);
            return false;
        }

        if (stored.code === code) {
            this.verificationCodes.delete(key);
            return true;
        }

        return false;
    }
}

module.exports = TwoFactorAuthService;
