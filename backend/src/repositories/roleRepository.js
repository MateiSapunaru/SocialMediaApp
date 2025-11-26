class RoleRepository {
  constructor(db) {
    this.db = db;
  }

  async findByName(name) {
    const [rows] = await this.db.execute('SELECT * FROM roles WHERE name = ?', [name]);
    return rows[0] || null;
  }

  async assignRoleToUser(userId, roleId) {
    await this.db.execute(
      'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [userId, roleId]
    );
  }

  async getRolesForUser(userId) {
    const [rows] = await this.db.execute(
      `SELECT r.name
       FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id = ?`,
      [userId]
    );
    return rows.map(r => r.name);
  }
}

module.exports = RoleRepository;
