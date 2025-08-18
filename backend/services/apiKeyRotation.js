
const crypto = require('crypto');
const cron = require('node-cron');
const { pool } = require('../config/database');

class APIKeyRotationService {
    // Generate secure API key
    static generateAPIKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Encrypt API key
    static encryptAPIKey(apiKey) {
        const cipher = crypto.createCipher('aes-256-cbc', process.env.API_KEYS_ENCRYPTION_KEY);
        let encrypted = cipher.update(apiKey, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // Decrypt API key
    static decryptAPIKey(encryptedKey) {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.API_KEYS_ENCRYPTION_KEY);
        let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // Create API key for user
    static async createAPIKey(userId, keyName, permissions = []) {
        try {
            const apiKey = this.generateAPIKey();
            const encryptedKey = this.encryptAPIKey(apiKey);
            const keyId = crypto.randomUUID();

            await pool.execute(`
                INSERT INTO api_keys (
                    id, user_id, key_name, encrypted_key, permissions, 
                    status, created_at, expires_at
                ) VALUES (?, ?, ?, ?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY))
            `, [keyId, userId, keyName, encryptedKey, JSON.stringify(permissions)]);

            return { keyId, apiKey };
        } catch (error) {
            throw new Error('Failed to create API key');
        }
    }

    // Rotate API key
    static async rotateAPIKey(keyId) {
        try {
            const newApiKey = this.generateAPIKey();
            const encryptedKey = this.encryptAPIKey(newApiKey);

            await pool.execute(`
                UPDATE api_keys 
                SET encrypted_key = ?, updated_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 90 DAY)
                WHERE id = ? AND status = 'active'
            `, [encryptedKey, keyId]);

            return newApiKey;
        } catch (error) {
            throw new Error('Failed to rotate API key');
        }
    }

    // Validate API key
    static async validateAPIKey(apiKey) {
        try {
            const [rows] = await pool.execute(`
                SELECT * FROM api_keys 
                WHERE status = 'active' AND expires_at > NOW()
            `);

            for (const row of rows) {
                const decryptedKey = this.decryptAPIKey(row.encrypted_key);
                if (decryptedKey === apiKey) {
                    return {
                        valid: true,
                        userId: row.user_id,
                        permissions: JSON.parse(row.permissions || '[]')
                    };
                }
            }

            return { valid: false };
        } catch (error) {
            return { valid: false };
        }
    }

    // Auto-rotate keys (runs daily)
    static startAutoRotation() {
        cron.schedule('0 0 * * *', async () => {
            try {
                // Find keys expiring in 7 days
                const [expiringKeys] = await pool.execute(`
                    SELECT id, user_id FROM api_keys 
                    WHERE status = 'active' AND expires_at <= DATE_ADD(NOW(), INTERVAL 7 DAY)
                `);

                for (const key of expiringKeys) {
                    await this.rotateAPIKey(key.id);
                    console.log(`Auto-rotated API key ${key.id} for user ${key.user_id}`);
                }
            } catch (error) {
                console.error('Auto-rotation error:', error);
            }
        });
    }
}

module.exports = APIKeyRotationService;
