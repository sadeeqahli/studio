
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

class PushNotificationService {
    // Send notification to specific user
    static async sendToUser(userId, title, body, data = {}) {
        try {
            // Get user's FCM tokens from database
            const [tokens] = await pool.execute(
                'SELECT fcm_token FROM user_fcm_tokens WHERE user_id = ? AND is_active = 1',
                [userId]
            );

            if (tokens.length === 0) {
                console.log(`No FCM tokens found for user ${userId}`);
                return;
            }

            const message = {
                notification: { title, body },
                data: {
                    ...data,
                    click_action: 'FLUTTER_NOTIFICATION_CLICK',
                    userId: userId
                },
                tokens: tokens.map(t => t.fcm_token)
            };

            const response = await admin.messaging().sendMulticast(message);
            
            // Log notification
            await this.logNotification(userId, title, body, data, response.successCount);

            return response;
        } catch (error) {
            console.error('Push notification error:', error);
            throw error;
        }
    }

    // Send notification to multiple users
    static async sendToMultipleUsers(userIds, title, body, data = {}) {
        const promises = userIds.map(userId => 
            this.sendToUser(userId, title, body, data)
        );
        return Promise.allSettled(promises);
    }

    // Send notification for booking confirmation
    static async sendBookingConfirmation(booking) {
        const title = 'Booking Confirmed! ⚽';
        const body = `Your booking for ${booking.pitch_name} on ${booking.date} has been confirmed.`;
        
        await this.sendToUser(booking.user_id, title, body, {
            type: 'booking_confirmed',
            bookingId: booking.id
        });

        // Also notify pitch owner
        const [ownerRows] = await pool.execute(`
            SELECT u.id FROM users u 
            JOIN pitches p ON u.id = p.owner_id 
            WHERE p.id = ?
        `, [booking.pitch_id]);

        if (ownerRows.length > 0) {
            await this.sendToUser(
                ownerRows[0].id,
                'New Booking Received! 💰',
                `New booking for ${booking.pitch_name} from ${booking.customer_name}`,
                { type: 'new_booking', bookingId: booking.id }
            );
        }
    }

    // Send payment confirmation
    static async sendPaymentConfirmation(booking, amount) {
        const title = 'Payment Successful! ✅';
        const body = `Payment of ₦${amount.toLocaleString()} for ${booking.pitch_name} was successful.`;
        
        await this.sendToUser(booking.user_id, title, body, {
            type: 'payment_confirmed',
            bookingId: booking.id,
            amount: amount.toString()
        });
    }

    // Send cashback notification
    static async sendCashbackNotification(userId, amount, bookingId) {
        const title = 'Cashback Earned! 🎉';
        const body = `You earned ₦${amount.toFixed(2)} cashback on your recent booking.`;
        
        await this.sendToUser(userId, title, body, {
            type: 'cashback_earned',
            amount: amount.toString(),
            bookingId
        });
    }

    // Register FCM token for user
    static async registerFCMToken(userId, token) {
        try {
            await pool.execute(`
                INSERT INTO user_fcm_tokens (user_id, fcm_token, is_active, created_at)
                VALUES (?, ?, 1, NOW())
                ON DUPLICATE KEY UPDATE 
                is_active = 1, updated_at = NOW()
            `, [userId, token]);
        } catch (error) {
            console.error('FCM token registration error:', error);
        }
    }

    // Log notification for analytics
    static async logNotification(userId, title, body, data, successCount) {
        try {
            await pool.execute(`
                INSERT INTO notification_logs (
                    id, user_id, title, body, data, success_count, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [
                crypto.randomUUID(),
                userId,
                title,
                body,
                JSON.stringify(data),
                successCount
            ]);
        } catch (error) {
            console.error('Notification logging error:', error);
        }
    }
}

module.exports = PushNotificationService;
