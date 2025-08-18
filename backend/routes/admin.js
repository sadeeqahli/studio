
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats with trial information
router.get('/stats', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        // Get various statistics
        const [userStats] = await pool.execute('SELECT COUNT(*) as total FROM users');
        const [pitchStats] = await pool.execute('SELECT COUNT(*) as total FROM pitches');
        const [bookingStats] = await pool.execute('SELECT COUNT(*) as total FROM bookings');
        const [revenueStats] = await pool.execute('SELECT SUM(amount) as total FROM bookings WHERE status = "Paid"');
        
        // Get trial statistics
        const [ownersTotal] = await pool.execute('SELECT COUNT(*) as total FROM users WHERE role = "Owner"');
        const [ownersOnTrial] = await pool.execute(`
            SELECT COUNT(*) as total FROM users 
            WHERE role = "Owner" AND trial_end_date > NOW()
        `);
        const [ownersWithPitches] = await pool.execute(`
            SELECT COUNT(DISTINCT owner_id) as total FROM pitches
        `);

        res.json({
            totalUsers: userStats[0].total,
            totalPitches: pitchStats[0].total,
            totalBookings: bookingStats[0].total,
            totalRevenue: revenueStats[0].total || 0,
            totalOwners: ownersTotal[0].total,
            ownersOnTrial: ownersOnTrial[0].total,
            ownersWithPitches: ownersWithPitches[0].total
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users with trial information
router.get('/users', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const [users] = await pool.execute(`
            SELECT id, name, email, role, total_bookings, pitches_listed, 
                   subscription_plan, status, created_at, trial_end_date, trial_type,
                   CASE 
                       WHEN trial_end_date > NOW() THEN DATEDIFF(trial_end_date, NOW())
                       ELSE 0
                   END as trial_days_remaining
            FROM users 
            ORDER BY created_at DESC
        `);

        res.json(users);
    } catch (error) {
        console.error('Get admin users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all pitches with owner trial information
router.get('/pitches', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const [pitches] = await pool.execute(`
            SELECT p.*, u.name as owner_name, u.trial_end_date, u.trial_type,
                   CASE 
                       WHEN u.trial_end_date > NOW() THEN DATEDIFF(u.trial_end_date, NOW())
                       ELSE 0
                   END as owner_trial_days_remaining
            FROM pitches p
            JOIN users u ON p.owner_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json(pitches);
    } catch (error) {
        console.error('Get admin pitches error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Toggle pitch status
router.patch('/pitches/:pitchId/toggle-status', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const { pitchId } = req.params;
        
        // Get current status
        const [pitch] = await pool.execute('SELECT status FROM pitches WHERE id = ?', [pitchId]);
        if (pitch.length === 0) {
            return res.status(404).json({ error: 'Pitch not found' });
        }
        
        const newStatus = pitch[0].status === 'Active' ? 'Inactive' : 'Active';
        
        await pool.execute('UPDATE pitches SET status = ? WHERE id = ?', [newStatus, pitchId]);
        
        res.json({ message: `Pitch ${newStatus.toLowerCase()} successfully`, status: newStatus });
    } catch (error) {
        console.error('Toggle pitch status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trial overview
router.get('/trial-overview', authenticateToken, requireRole(['Admin']), async (req, res) => {
    try {
        const [trialData] = await pool.execute(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.trial_type,
                u.trial_end_date,
                u.created_at,
                CASE 
                    WHEN u.trial_end_date > NOW() THEN DATEDIFF(u.trial_end_date, NOW())
                    ELSE 0
                END as days_remaining,
                COUNT(p.id) as pitches_count
            FROM users u
            LEFT JOIN pitches p ON u.id = p.owner_id
            WHERE u.role = 'Owner' AND u.trial_end_date IS NOT NULL
            GROUP BY u.id
            ORDER BY u.created_at ASC
        `);

        res.json(trialData);
    } catch (error) {
        console.error('Get trial overview error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
