
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        // Get various statistics
        const [userStats] = await pool.execute('SELECT COUNT(*) as total FROM users');
        const [pitchStats] = await pool.execute('SELECT COUNT(*) as total FROM pitches');
        const [bookingStats] = await pool.execute('SELECT COUNT(*) as total FROM bookings');
        const [revenueStats] = await pool.execute('SELECT SUM(amount) as total FROM bookings WHERE status = "Paid"');

        res.json({
            totalUsers: userStats[0].total,
            totalPitches: pitchStats[0].total,
            totalBookings: bookingStats[0].total,
            totalRevenue: revenueStats[0].total || 0
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
router.get('/users', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const [users] = await pool.execute(`
            SELECT id, name, email, role, total_bookings, pitches_listed, 
                   subscription_plan, status, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);

        res.json(users);
    } catch (error) {
        console.error('Get admin users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
