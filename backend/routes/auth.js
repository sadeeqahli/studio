const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Generate referral code
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Register
router.post('/signup', authLimiter, async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if user exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate user ID and referral code
        const userId = uuidv4();
        const referralCode = generateReferralCode();

        // Determine subscription plan and trial period based on role and owner count
        let subscriptionPlan = 'Starter';
        let trialEndDate = null;
        let trialType = null;

        if (role === 'Owner') {
            const [ownerCount] = await pool.execute(
                'SELECT COUNT(*) as count FROM users WHERE role = "Owner"'
            );

            const currentOwnerCount = ownerCount[0].count;

            if (currentOwnerCount < 30) {
                // First 30 owners get 90 days free trial
                trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 90);
                trialType = '90_days_free';
            } else if (currentOwnerCount < 50) {
                // Next 20 owners get 30 days free trial
                trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 30);
                trialType = '30_days_free';
            }
            // After 50 owners, no free trial (trialEndDate remains null)
        }

        // Create user
        await pool.execute(`
            INSERT INTO users (
                id, name, email, password, phone, role, 
                referral_code, subscription_plan, status, trial_end_date, trial_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
        `, [userId, name, email, hashedPassword, phone, role, referralCode, subscriptionPlan, trialEndDate, trialType]);

        // Generate token
        const user = { id: userId, email, role, name };
        const token = generateToken(user);

        res.status(201).json({
            message: 'User created successfully',
            user: { id: userId, name, email, role, referralCode },
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Get user
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND role = ? AND status = "Active"',
            [email, role]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionPlan: user.subscription_plan
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Owner signup
router.post('/signup/owner', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const [existingUser] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Check how many owners have been registered to determine trial
        const [ownerCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "Owner"');
        const currentOwnerCount = ownerCount[0].count;

        let trialEndDate = null;
        let trialType = null;

        if (currentOwnerCount < 30) {
            // First 30 owners get 90 days free trial
            trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 90);
            trialType = '90_days_free';
        } else if (currentOwnerCount < 50) {
            // Next 20 owners (31-50) get 30 days free trial
            trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + 30);
            trialType = '30_days_free';
        }
        // After 50 owners, no free trial (trialEndDate and trialType remain null)

        // Insert user with trial information
        await pool.execute(
            'INSERT INTO users (id, name, email, password, role, trial_end_date, trial_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, name, email, hashedPassword, 'Owner', trialEndDate, trialType]
        );

        // Generate token
        const token = jwt.sign({ userId, role: 'Owner' }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'Owner account created successfully',
            token,
            user: { 
                id: userId, 
                name, 
                email, 
                role: 'Owner',
                trialEndDate,
                trialType,
                trialMessage: trialType ? `Congratulations! You've received a ${trialType === '90_days_free' ? '90' : '30'} day free trial!` : 'Welcome! Start with our Starter plan.'
            }
        });
    } catch (error) {
        console.error('Owner signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;