class PostRepository {
  constructor(db) {
    this.db = db;
  }

  async create({ userId, title, content }) {
    const [result] = await this.db.execute(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await this.db.execute(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findAll() {
    const [rows] = await this.db.execute(
      `SELECT p.*, u.username,
              (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id) as likeCount
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.is_published = 1
       ORDER BY p.created_at DESC`
    );
    return rows;
  }

  async findByUser(userId) {
    const [rows] = await this.db.execute(
      'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  async update(id, { title, content }) {
    await this.db.execute(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );
  }

  async delete(id) {
    await this.db.execute('DELETE FROM posts WHERE id = ?', [id]);
  }
}

module.exports = PostRepository;
