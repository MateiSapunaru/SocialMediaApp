const AuthService = require('../authService');

describe('AuthService', () => {
  let userRepo, roleRepo, refreshRepo, jwtUtil, passwordUtil, authService;

  beforeEach(() => {
    userRepo = { findByEmail: jest.fn(), create: jest.fn() };
    roleRepo = { findByName: jest.fn(), assignRoleToUser: jest.fn(), getRolesForUser: jest.fn() };
    refreshRepo = { save: jest.fn(), findUserByToken: jest.fn(), delete: jest.fn() };
    jwtUtil = { generateAccessToken: jest.fn(() => 'signed-token') };
    passwordUtil = { hash: jest.fn(async (p) => `hashed-${p}`), compare: jest.fn() };
    authService = new AuthService(userRepo, roleRepo, refreshRepo, jwtUtil, passwordUtil);
  });

  describe('register', () => {
    it('creates a user and assigns the USER role when the email is free', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.create.mockResolvedValue({ id: 1, username: 'alice', email: 'a@b.com' });
      roleRepo.findByName.mockResolvedValue({ id: 2, name: 'USER' });

      const user = await authService.register({ username: 'alice', email: 'a@b.com', password: 'secret123' });

      expect(passwordUtil.hash).toHaveBeenCalledWith('secret123');
      expect(userRepo.create).toHaveBeenCalledWith({
        username: 'alice',
        email: 'a@b.com',
        passwordHash: 'hashed-secret123'
      });
      expect(roleRepo.assignRoleToUser).toHaveBeenCalledWith(1, 2);
      expect(user).toEqual({ id: 1, username: 'alice', email: 'a@b.com' });
    });

    it('rejects registration with a 409 when the email is already taken', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 5 });

      await expect(
        authService.register({ username: 'bob', email: 'taken@b.com', password: 'secret123' })
      ).rejects.toMatchObject({ statusCode: 409 });

      expect(userRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns an access token and persists a refresh token on valid credentials', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 1, is_active: 1, password_hash: 'hashed' });
      passwordUtil.compare.mockResolvedValue(true);
      roleRepo.getRolesForUser.mockResolvedValue(['USER']);

      const result = await authService.login({ email: 'a@b.com', password: 'secret123' });

      expect(result.accessToken).toBe('signed-token');
      expect(typeof result.refreshToken).toBe('string');
      expect(refreshRepo.save).toHaveBeenCalledWith(1, result.refreshToken);
    });

    it('rejects an unknown email', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'x@x.com', password: 'x' })).rejects.toThrow('Invalid credentials');
    });

    it('rejects a disabled user', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 1, is_active: 0 });
      await expect(authService.login({ email: 'a@b.com', password: 'x' })).rejects.toThrow('User is disabled');
    });

    it('rejects a wrong password', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 1, is_active: 1, password_hash: 'hashed' });
      passwordUtil.compare.mockResolvedValue(false);
      await expect(authService.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('deletes the refresh token', async () => {
      await authService.logout('token-123');
      expect(refreshRepo.delete).toHaveBeenCalledWith('token-123');
    });
  });
});
