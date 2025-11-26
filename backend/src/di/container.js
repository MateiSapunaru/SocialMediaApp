const db = require('../config/db');

// repositories
const UserRepository = require('../repositories/userRepository');
const RoleRepository = require('../repositories/roleRepository');
const RefreshTokenRepository = require('../repositories/refreshTokenRepository');
const PostRepository = require('../repositories/postRepository');
const CommentRepository = require('../repositories/commentRepository');
const LikeRepository = require('../repositories/likeRepository');

// services
const AuthService = require('../services/authService');
const PostService = require('../services/postService');

// utils
const jwtUtil = require('../utils/jwt');
const passwordUtil = require('../utils/password');

// controllers
const AuthController = require('../controllers/authController');
const PostController = require('../controllers/postController');

// Instantiate repos
const userRepo = new UserRepository(db);
const roleRepo = new RoleRepository(db);
const refreshTokenRepo = new RefreshTokenRepository(db);
const postRepo = new PostRepository(db);
const commentRepo = new CommentRepository(db);
const likeRepo = new LikeRepository(db);

// Services
const authService = new AuthService(
  userRepo,
  roleRepo,
  refreshTokenRepo,
  jwtUtil,
  passwordUtil
);
const postService = new PostService(postRepo, commentRepo, likeRepo);

// Controllers
const authController = new AuthController(authService);
const postController = new PostController(postService, postRepo);

module.exports = {
  authController,
  postController
};
