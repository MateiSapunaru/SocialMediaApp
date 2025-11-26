const express = require('express');
const authenticate = require('../middlewares/authMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');

function createPostRouter(postController) {
  const router = express.Router();

  router.get('/', postController.getFeed);
  router.get('/:id', postController.getPost);

  router.post('/', authenticate, postController.createPost);
  router.put('/:id', authenticate, postController.updatePost);
  router.delete('/:id', authenticate, postController.deletePost);

  router.post('/:id/comments', authenticate, postController.addComment);
  router.post('/:id/like', rateLimitMiddleware.apiLimiter, authenticate, postController.toggleLike);

  return router;
}

module.exports = createPostRouter;
