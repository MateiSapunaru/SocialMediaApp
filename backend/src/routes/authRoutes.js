const express = require('express');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const authenticate = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const validate = require('../middlewares/validationMiddleware');

function createAuthRouter(authController) {
  const router = express.Router();

  router.post('/register', rateLimitMiddleware.authLimiter, registerValidation, validate, authController.register);
  router.post('/login', rateLimitMiddleware.authLimiter, loginValidation, validate, authController.login);
  router.post('/refresh', rateLimitMiddleware.authLimiter, authController.refresh);
  router.post('/logout', rateLimitMiddleware.authLimiter, authController.logout);
  router.get('/users', authenticate, requireRole('ADMIN'), authController.listUsers);

  return router;
}

module.exports = createAuthRouter;
