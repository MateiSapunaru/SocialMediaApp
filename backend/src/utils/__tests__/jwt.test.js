describe('jwt utils', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, ACCESS_TOKEN_SECRET: 'test-secret', ACCESS_TOKEN_EXPIRES: '15m' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('round-trips a token generated for a user', () => {
    const { generateAccessToken, verifyAccessToken } = require('../jwt');
    const user = { id: 1, email: 'a@b.com', username: 'alice' };

    const token = generateAccessToken(user, ['USER']);
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe(1);
    expect(payload.email).toBe('a@b.com');
    expect(payload.username).toBe('alice');
    expect(payload.roles).toEqual(['USER']);
  });

  it('throws when verifying a malformed token', () => {
    const { verifyAccessToken } = require('../jwt');
    expect(() => verifyAccessToken('not-a-real-token')).toThrow();
  });

  it('throws when verifying a token signed with a different secret', () => {
    const { generateAccessToken } = require('../jwt');
    const token = generateAccessToken({ id: 1, email: 'a@b.com', username: 'alice' }, []);

    jest.resetModules();
    process.env = { ...OLD_ENV, ACCESS_TOKEN_SECRET: 'a-different-secret', ACCESS_TOKEN_EXPIRES: '15m' };
    const { verifyAccessToken } = require('../jwt');

    expect(() => verifyAccessToken(token)).toThrow();
  });
});
