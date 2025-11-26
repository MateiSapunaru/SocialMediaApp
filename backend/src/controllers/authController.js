class AuthController {
  constructor(authService) {
    this.authService = authService;

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
    this.logout = this.logout.bind(this);
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await this.authService.register({ username, email, password });
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.login({ email, password });
      res.json(tokens);
    } catch (err) {
      err.statusCode = err.statusCode || 401;
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refresh(refreshToken);
      res.json(result);
    } catch (err) {
      err.statusCode = 401;
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
