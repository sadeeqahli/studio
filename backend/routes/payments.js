const express = require('express');
const Flutterwave = require('flutterwave-node-v3');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validatePaymentData } = require('../middleware/validation');
const { paymentLimiter } = require('../middleware/security');

const router = express.Router();

// Initialize Flutterwave
const flw = new Flutterwave(
    process.env.FLUTTERWAVE_PUBLIC_KEY,
    process.env.FLUTTERWAVE_SECRET_KEY
);

// Initialize payment
router.post('/initialize', paymentLimiter, authenticateToken, validatePaymentData, async (req, res) => {
    try {
        const {
            amount,
            currency = 'NGN',
            pitchId,
            selectedDate,
            selectedSlots,
            customerEmail,
            customerPhone,
            customerName,
            paymentMethod = 'card'
        } = req.body;

        const userId = req.user.id;
        const txRef = `9JPC-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Get pitch details
        const [pitchRows] = await pool.execute(
            'SELECT * FROM pitches WHERE id = ?',
            [pitchId]
        );

        if (pitchRows.length === 0) {
            return res.status(404).json({ error: 'Pitch not found' });
        }

        const pitch = pitchRows[0];

        // Get owner details for subaccount
        const [ownerRows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [pitch.owner_id]
        );

        const owner = ownerRows[0];

        // Create pending booking
        const bookingId = `BK-${Date.now()}-${uuidv4().slice(0, 8)}`;

        await pool.execute(`
            INSERT INTO bookings (
                id, pitch_id, pitch_name, user_id, customer_name, 
                date, time, amount, status, booking_type, 
                payment_reference, flutterwave_tx_ref
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Online', ?, ?)
        `, [
            bookingId,
            pitchId,
            pitch.name,
            userId,
            customerName,
            selectedDate,
            selectedSlots.join(', '),
            amount,
            txRef,
            txRef
        ]);

        // Prepare Flutterwave payment payload
        const payload = {
            tx_ref: txRef,
            amount: amount,
            currency: currency,
            redirect_url: `${process.env.FRONTEND_URL}/dashboard/receipt/${bookingId}`,
            payment_options: paymentMethod,
            customer: {
                email: customerEmail,
                phone_number: customerPhone,
                name: customerName,
            },
            customizations: {
                title: '9ja Pitch Connect',
                description: `Booking payment for ${pitch.name}`,
                logo: `${process.env.FRONTEND_URL}/logo.png`,
            },
            meta: {
                booking_id: bookingId,
                pitch_id: pitchId,
                user_id: userId
            }
        };

        // Add subaccount for revenue split if owner has one
        if (owner && owner.flutterwave_subaccount_id) {
            // Check if owner is still on trial
            const [ownerTrial] = await pool.execute(
                'SELECT trial_end_date FROM users WHERE id = ? AND role = "Owner"',
                [pitch.owner_id]
            );

            let commissionRate = 0;
            let commissionFee = 0;

            // Only charge commission if trial has expired
            if (!ownerTrial[0]?.trial_end_date || new Date() > new Date(ownerTrial[0].trial_end_date)) {
                commissionRate = 0.05; // 5% commission after trial
                commissionFee = amount * commissionRate;
            }

            const netPayout = amount - commissionFee;

            payload.subaccounts = [{
                id: owner.flutterwave_subaccount_id,
                transaction_split_ratio: (1 - commissionRate) * 100
            }];
        }

        // Initialize payment with Flutterwave
        const response = await flw.StandardSubaccounts.create(payload);

        if (response.status === 'success') {
            res.json({
                status: 'success',
                data: {
                    payment_link: response.data.link,
                    tx_ref: txRef,
                    booking_id: bookingId
                }
            });
        } else {
            // Delete pending booking if payment initialization fails
            await pool.execute('DELETE FROM bookings WHERE id = ?', [bookingId]);

            res.status(400).json({
                status: 'error',
                message: 'Payment initialization failed',
                details: response.message
            });
        }

    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Verify payment
router.post('/verify/:tx_ref', authenticateToken, async (req, res) => {
    try {
        const { tx_ref } = req.params;

        // Verify transaction with Flutterwave
        const response = await flw.Transaction.verify({ id: tx_ref });

        if (response.status === 'success' && response.data.status === 'successful') {
            const transaction = response.data;

            // Update booking status
            await pool.execute(`
                UPDATE bookings 
                SET status = 'Paid', payment_method = ?, updated_at = NOW()
                WHERE flutterwave_tx_ref = ?
            `, [transaction.payment_type, tx_ref]);

            // Get booking details
            const [bookingRows] = await pool.execute(
                'SELECT * FROM bookings WHERE flutterwave_tx_ref = ?',
                [tx_ref]
            );

            if (bookingRows.length > 0) {
                const booking = bookingRows[0];

                // Process commission and payouts
                await processCommissionAndPayouts(booking, transaction);

                // Add cashback rewards
                await addCashbackReward(booking.user_id, booking.amount, booking.id);

                // Update user booking count
                await pool.execute(
                    'UPDATE users SET total_bookings = total_bookings + 1 WHERE id = ?',
                    [booking.user_id]
                );

                res.json({
                    status: 'success',
                    message: 'Payment verified successfully',
                    data: {
                        booking_id: booking.id,
                        amount: booking.amount,
                        status: 'Paid'
                    }
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Booking not found'
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Payment verification failed',
                details: response.message
            });
        }

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Flutterwave webhook handler
router.post('/webhook', async (req, res) => {
    try {
        const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
        const signature = req.headers['verif-hash'];

        if (!signature || signature !== secretHash) {
            return res.status(401).end();
        }

        const payload = req.body;

        if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
            const transaction = payload.data;
            const tx_ref = transaction.tx_ref;

            // Update booking status
            await pool.execute(`
                UPDATE bookings 
                SET status = 'Paid', payment_method = ?, updated_at = NOW()
                WHERE flutterwave_tx_ref = ?
            `, [transaction.payment_type, tx_ref]);

            // Get booking details
            const [bookingRows] = await pool.execute(
                'SELECT * FROM bookings WHERE flutterwave_tx_ref = ?',
                [tx_ref]
            );

            if (bookingRows.length > 0) {
                const booking = bookingRows[0];
                await processCommissionAndPayouts(booking, transaction);
                await addCashbackReward(booking.user_id, booking.amount, booking.id);
            }
        }

        res.status(200).end();

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).end();
    }
});

// Helper function to process commission and payouts
async function processCommissionAndPayouts(booking, transaction) {
    try {
        // Get owner details
        const [ownerRows] = await pool.execute(`
            SELECT u.* FROM users u 
            JOIN pitches p ON u.id = p.owner_id 
            WHERE p.id = ?
        `, [booking.pitch_id]);

        if (ownerRows.length === 0) return;

        const owner = ownerRows[0];
        
        // Check if owner is still on trial
        const [ownerTrial] = await pool.execute(
            'SELECT trial_end_date FROM users WHERE id = ? AND role = "Owner"',
            [owner.id]
        );

        let commissionRate = 0;
        let commissionFee = 0;

        // Only charge commission if trial has expired
        if (!ownerTrial[0]?.trial_end_date || new Date() > new Date(ownerTrial[0].trial_end_date)) {
            commissionRate = 0.05; // 5% commission after trial
            commissionFee = booking.amount * commissionRate;
        }

        const netPayout = booking.amount - commissionFee;

        // Create payout record
        await pool.execute(`
            INSERT INTO payouts (
                id, booking_id, owner_id, customer_name, gross_amount,
                commission_rate, commission_fee, net_payout, status, processed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Paid Out', NOW())
        `, [
            uuidv4(),
            booking.id,
            owner.id,
            booking.customer_name,
            booking.amount,
            commissionRate * 100,
            commissionFee,
            netPayout
        ]);

        // Update owner wallet balance
        await pool.execute(
            'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
            [netPayout, owner.id]
        );

        // Create transaction records
        await pool.execute(`
            INSERT INTO transactions (
                id, user_id, booking_id, type, amount, status, 
                payment_reference, description
            ) VALUES (?, ?, ?, 'Payout', ?, 'Completed', ?, ?)
        `, [
            uuidv4(),
            owner.id,
            booking.id,
            netPayout,
            transaction.tx_ref,
            `Payout for booking ${booking.id}`
        ]);

    } catch (error) {
        console.error('Commission processing error:', error);
    }
}

// Helper function to add cashback reward
async function addCashbackReward(userId, bookingAmount, bookingId) {
    try {
        // Get pitch owner ID from booking
        const [bookingOwner] = await pool.execute(
            'SELECT p.owner_id FROM bookings b JOIN pitches p ON b.pitch_id = p.id WHERE b.id = ?',
            [bookingId]
        );

        if (bookingOwner.length === 0) {
            console.error('Owner not found for booking:', bookingId);
            return;
        }

        const ownerId = bookingOwner[0].owner_id;

        // Check if pitch owner is still on trial before giving cashback
        const [ownerTrialStatus] = await pool.execute(
            'SELECT trial_end_date FROM users WHERE id = ?',
            [ownerId]
        );

        // Only give cashback if owner's trial has expired
        if (!ownerTrialStatus[0]?.trial_end_date || new Date() > new Date(ownerTrialStatus[0].trial_end_date)) {
            // Add cashback for player (30 Naira)
            const cashbackAmount = 30;
            await pool.execute(
                'UPDATE users SET reward_balance = reward_balance + ? WHERE id = ?',
                [cashbackAmount, userId]
            );

            // Record cashback transaction
            await pool.execute(
                'INSERT INTO reward_transactions (id, user_id, type, amount, description, related_booking_id) VALUES (?, ?, ?, ?, ?, ?)',
                [uuidv4(), userId, 'Cashback', cashbackAmount, `Cashback for booking ${bookingId}`, bookingId]
            );
        }

    } catch (error) {
        console.error('Cashback processing error:', error);
    }
}

module.exports = router;