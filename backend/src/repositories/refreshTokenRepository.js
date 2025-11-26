const { REFRESH_TOKEN_TTL_DAYS } = require('../config/env');

class RefreshTokenRepository {
  constructor(db) {
    this.db = db;
  }

  async save(userId, token) {
    const [result] = await this.db.execute(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [userId, token, REFRESH_TOKEN_TTL_DAYS]
    );
    return result.insertId;
  }

  async delete(token) {
    await this.db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }

  async deleteAllForUser(userId) {
    await this.db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }

  async findUserByToken(token) {
    const [rows] = await this.db.execute(
      `SELECT u.*
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token = ? AND rt.expires_at > NOW()`,
      [token]
    );
    return rows[0] || null;
  }
}

module.exports = RefreshTokenRepository;
