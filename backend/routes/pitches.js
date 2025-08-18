
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all pitches
router.get('/', async (req, res) => {
    try {
        const [pitches] = await pool.execute(`
            SELECT p.*, u.name as owner_name 
            FROM pitches p 
            JOIN users u ON p.owner_id = u.id 
            WHERE p.status = 'Active'
            ORDER BY p.created_at DESC
        `);

        res.json(pitches);
    } catch (error) {
        console.error('Get pitches error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get pitch by ID
router.get('/:id', async (req, res) => {
    try {
        const [pitches] = await pool.execute(`
            SELECT p.*, u.name as owner_name 
            FROM pitches p 
            JOIN users u ON p.owner_id = u.id 
            WHERE p.id = ?
        `, [req.params.id]);

        if (pitches.length === 0) {
            return res.status(404).json({ error: 'Pitch not found' });
        }

        res.json(pitches[0]);
    } catch (error) {
        console.error('Get pitch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create pitch (Owner only)
router.post('/', authenticateToken, requireRole(['Owner']), async (req, res) => {
    try {
        const { name, location, price, image_url, image_hint, slot_interval } = req.body;
        const pitchId = uuidv4();

        await pool.execute(`
            INSERT INTO pitches (id, name, location, price, image_url, image_hint, owner_id, slot_interval)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [pitchId, name, location, price, image_url, image_hint, req.user.id, slot_interval || 60]);

        // Update user's pitches listed count
        await pool.execute(
            'UPDATE users SET pitches_listed = pitches_listed + 1 WHERE id = ?',
            [req.user.id]
        );

        res.status(201).json({ 
            message: 'Pitch created successfully',
            pitchId 
        });
    } catch (error) {
        console.error('Create pitch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update pitch (Owner only)
router.put('/:id', authenticateToken, requireRole(['Owner']), async (req, res) => {
    try {
        const { name, location, price, image_url, image_hint, slot_interval } = req.body;

        // Verify ownership
        const [pitches] = await pool.execute(
            'SELECT owner_id FROM pitches WHERE id = ?',
            [req.params.id]
        );

        if (pitches.length === 0) {
            return res.status(404).json({ error: 'Pitch not found' });
        }

        if (pitches[0].owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await pool.execute(`
            UPDATE pitches 
            SET name = ?, location = ?, price = ?, image_url = ?, image_hint = ?, slot_interval = ?, updated_at = NOW()
            WHERE id = ?
        `, [name, location, price, image_url, image_hint, slot_interval, req.params.id]);

        res.json({ message: 'Pitch updated successfully' });
    } catch (error) {
        console.error('Update pitch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
