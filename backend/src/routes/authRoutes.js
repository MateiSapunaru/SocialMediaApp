const express = require('express');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');

function createAuthRouter(authController) {
  const router = express.Router();

  router.post('/register', rateLimitMiddleware.authLimiter, authController.register);
  router.post('/login', rateLimitMiddleware.authLimiter, authController.login);
  router.post('/refresh', rateLimitMiddleware.authLimiter, authController.refresh);
  router.post('/logout', rateLimitMiddleware.authLimiter, authController.logout);

  return router;
}

module.exports = createAuthRouter;
