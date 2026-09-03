const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createPostValidation, commentValidation } = require('../validators/postValidators');

function createPostRouter(postController) {
  const router = express.Router();

  router.get('/', postController.getFeed);
  router.get('/:id', postController.getPost);

  router.post('/', authenticate, createPostValidation, validate, postController.createPost);
  router.put('/:id', authenticate, createPostValidation, validate, postController.updatePost);
  router.delete('/:id', authenticate, postController.deletePost);

  router.post('/:id/comments', authenticate, commentValidation, validate, postController.addComment);
  router.post('/:id/like', rateLimitMiddleware.apiLimiter, authenticate, postController.toggleLike);

  return router;
}

module.exports = createPostRouter;
