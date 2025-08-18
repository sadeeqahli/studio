
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user rewards
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rewards] = await pool.execute(`
            SELECT * FROM reward_transactions 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        `, [req.user.id]);

        const [userBalance] = await pool.execute(
            'SELECT reward_balance FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({
            balance: userBalance[0]?.reward_balance || 0,
            transactions: rewards
        });
    } catch (error) {
        console.error('Get rewards error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Use rewards
router.post('/use', authenticateToken, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        // Check user balance
        const [users] = await pool.execute(
            'SELECT reward_balance FROM users WHERE id = ?',
            [req.user.id]
        );

        const user = users[0];
        if (user.reward_balance < amount) {
            return res.status(400).json({ error: 'Insufficient reward balance' });
        }

        // Create reward usage transaction
        await pool.execute(`
            INSERT INTO reward_transactions (
                id, user_id, type, amount, description, 
                related_booking_id, status
            ) VALUES (?, ?, 'Used', ?, ?, ?, 'Active')
        `, [
            uuidv4(),
            req.user.id,
            -amount,
            `Reward used for booking ${bookingId}`,
            bookingId
        ]);

        // Update user balance
        await pool.execute(
            'UPDATE users SET reward_balance = reward_balance - ? WHERE id = ?',
            [amount, req.user.id]
        );

        res.json({ message: 'Rewards used successfully' });
    } catch (error) {
        console.error('Use rewards error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
