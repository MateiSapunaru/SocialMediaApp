class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async findByEmail(email) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await this.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async create({ username, email, passwordHash }) {
    const [result] = await this.db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return { id: result.insertId, username, email };
  }
}

module.exports = UserRepository;
