
const { pool } = require('../config/database');

class MonitoringService {
    // Track API usage
    static async trackAPIUsage(userId, endpoint, method, statusCode, responseTime, userAgent, ipAddress) {
        try {
            await pool.execute(`
                INSERT INTO api_usage_logs (
                    id, user_id, endpoint, method, status_code, 
                    response_time_ms, user_agent, ip_address, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                crypto.randomUUID(),
                userId,
                endpoint,
                method,
                statusCode,
                responseTime,
                userAgent,
                ipAddress
            ]);
        } catch (error) {
            console.error('API usage tracking error:', error);
        }
    }

    // Get system health metrics
    static async getSystemHealth() {
        try {
            const [dbHealth] = await pool.execute('SELECT 1 as status');
            
            const [userStats] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_users,
                    COUNT(CASE WHEN created_at >= CURDATE() THEN 1 END) as users_today
                FROM users
            `);

            const [bookingStats] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_bookings,
                    COUNT(CASE WHEN status = 'Paid' THEN 1 END) as paid_bookings,
                    COUNT(CASE WHEN created_at >= CURDATE() THEN 1 END) as bookings_today,
                    SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as total_revenue
                FROM bookings
            `);

            const [apiUsage] = await pool.execute(`
                SELECT 
                    COUNT(*) as total_requests,
                    AVG(response_time_ms) as avg_response_time,
                    COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
                FROM api_usage_logs 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `);

            return {
                database: { status: 'healthy', connected: dbHealth.length > 0 },
                users: userStats[0],
                bookings: bookingStats[0],
                api: apiUsage[0] || { total_requests: 0, avg_response_time: 0, error_count: 0 },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                database: { status: 'error', error: error.message },
                timestamp: new Date().toISOString()
            };
        }
    }

    // Get advanced analytics
    static async getAdvancedAnalytics(timeRange = '30d') {
        try {
            const interval = timeRange === '7d' ? '7 DAY' : timeRange === '1d' ? '1 DAY' : '30 DAY';

            const [revenueAnalytics] = await pool.execute(`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as bookings,
                    SUM(amount) as revenue,
                    AVG(amount) as avg_booking_value
                FROM bookings 
                WHERE status = 'Paid' AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `);

            const [userGrowth] = await pool.execute(`
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as new_users,
                    SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
                FROM users 
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            `);

            const [topPitches] = await pool.execute(`
                SELECT 
                    p.name,
                    p.location,
                    COUNT(b.id) as total_bookings,
                    SUM(b.amount) as total_revenue
                FROM pitches p
                JOIN bookings b ON p.id = b.pitch_id
                WHERE b.status = 'Paid' AND b.created_at >= DATE_SUB(NOW(), INTERVAL ${interval})
                GROUP BY p.id, p.name, p.location
                ORDER BY total_revenue DESC
                LIMIT 10
            `);

            return {
                revenueAnalytics,
                userGrowth,
                topPitches,
                timeRange,
                generated_at: new Date().toISOString()
            };
        } catch (error) {
            throw new Error('Failed to generate analytics');
        }
    }
}

module.exports = MonitoringService;
