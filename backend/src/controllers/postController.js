class PostController {
  constructor(postService, postRepo) {
    this.postService = postService;
    this.postRepo = postRepo;

    this.getFeed = this.getFeed.bind(this);
    this.getPost = this.getPost.bind(this);
    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.addComment = this.addComment.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
  }

  async getFeed(req, res, next) {
    try {
      const posts = await this.postService.getFeed();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  async getPost(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.postService.getPostWithComments(id);
      if (!result) return res.status(404).json({ message: 'Post not found' });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const post = await this.postService.createPost(req.user.id, { title, content });
      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.postRepo.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      const updated = await this.postService.updatePost(
        post,
        req.user.id,
        { title: req.body.title, content: req.body.content },
        req.user.roles
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.postRepo.findById(id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      await this.postService.deletePost(post, req.user.id, req.user.roles);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const postId = parseInt(req.params.id, 10);
      const { content } = req.body;
      const comment = await this.postService.addComment(postId, req.user.id, { content });
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const postId = parseInt(req.params.id, 10);
      const result = await this.postService.toggleLike(postId, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PostController;
