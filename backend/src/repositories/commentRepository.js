class CommentRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ postId, userId, content }) {
    const [result] = await this.db.execute(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content]
    );
    return result.insertId;
  }

  async findByPost(postId) {
    const [rows] = await this.db.execute(
      `SELECT c.*, u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [postId]
    );
    return rows;
  }
}

module.exports = CommentRepository;
