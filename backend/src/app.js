const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const errorMiddleware = require('./middlewares/errorMiddleware.js');
const { authController, postController } = require('./di/container');

// routes
const createAuthRouter = require('./routes/authRoutes');
const createPostRouter = require('./routes/postRoutes');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Social Media API running' });
  });

  app.use('/auth', createAuthRouter(authController));
  app.use('/posts', createPostRouter(postController));

  app.use(errorMiddleware);

  return app;
}

module.exports = createApp;
