
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [bookings] = await pool.execute(`
            SELECT b.*, p.name as pitch_name, p.location 
            FROM bookings b 
            JOIN pitches p ON b.pitch_id = p.id 
            WHERE b.user_id = ? 
            ORDER BY b.created_at DESC
        `, [req.user.id]);

        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [bookings] = await pool.execute(`
            SELECT b.*, p.name as pitch_name, p.location 
            FROM bookings b 
            JOIN pitches p ON b.pitch_id = p.id 
            WHERE b.id = ? AND b.user_id = ?
        `, [req.params.id, req.user.id]);

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(bookings[0]);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create booking
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { pitchId, selectedDate, selectedSlots, amount, customerName } = req.body;
        const bookingId = `BK-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Get pitch details
        const [pitches] = await pool.execute(
            'SELECT * FROM pitches WHERE id = ? AND status = "Active"',
            [pitchId]
        );

        if (pitches.length === 0) {
            return res.status(404).json({ error: 'Pitch not found or inactive' });
        }

        const pitch = pitches[0];

        // Create booking
        await pool.execute(`
            INSERT INTO bookings (
                id, pitch_id, pitch_name, user_id, customer_name, 
                date, time, amount, status, booking_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Online')
        `, [
            bookingId,
            pitchId,
            pitch.name,
            req.user.id,
            customerName,
            selectedDate,
            selectedSlots.join(', '),
            amount
        ]);

        res.status(201).json({
            message: 'Booking created successfully',
            bookingId,
            booking: {
                id: bookingId,
                pitchId,
                pitchName: pitch.name,
                date: selectedDate,
                time: selectedSlots.join(', '),
                amount,
                status: 'Pending'
            }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
