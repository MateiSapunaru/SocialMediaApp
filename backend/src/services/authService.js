const crypto = require('crypto');

class AuthService {
  constructor(userRepo, roleRepo, refreshRepo, jwtUtil, passwordUtil) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
    this.refreshRepo = refreshRepo;
    this.jwtUtil = jwtUtil;
    this.passwordUtil = passwordUtil;
  }

  async register({ username, email, password }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await this.passwordUtil.hash(password);
    const user = await this.userRepo.create({ username, email, passwordHash });

    const userRole = await this.roleRepo.findByName('USER');
    if (userRole) {
      await this.roleRepo.assignRoleToUser(user.id, userRole.id);
    }

    return user;
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    if (!user.is_active) throw new Error('User is disabled');

    const ok = await this.passwordUtil.compare(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');

    const roles = await this.roleRepo.getRolesForUser(user.id);
    const accessToken = this.jwtUtil.generateAccessToken(user, roles);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    await this.refreshRepo.save(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    const user = await this.refreshRepo.findUserByToken(refreshToken);
    if (!user) throw new Error('Invalid refresh token');

    const roles = await this.roleRepo.getRolesForUser(user.id);
    const accessToken = this.jwtUtil.generateAccessToken(user, roles);
    return { accessToken };
  }

  async logout(refreshToken) {
    await this.refreshRepo.delete(refreshToken);
  }
}

module.exports = AuthService;
