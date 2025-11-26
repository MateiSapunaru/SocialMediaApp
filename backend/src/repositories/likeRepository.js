class LikeRepository {
  constructor(db) {
    this.db = db;
  }

  async hasUserLiked(postId, userId) {
    const [rows] = await this.db.execute(
      'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    return rows.length > 0;
  }

  async like(postId, userId) {
    await this.db.execute(
      'INSERT IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
  }

  async unlike(postId, userId) {
    await this.db.execute(
      'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
  }
}

module.exports = LikeRepository;
