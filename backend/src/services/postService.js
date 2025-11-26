class PostService {
  constructor(postRepo, commentRepo, likeRepo) {
    this.postRepo = postRepo;
    this.commentRepo = commentRepo;
    this.likeRepo = likeRepo;
  }

  async getFeed() {
    return this.postRepo.findAll();
  }

  async getPostWithComments(id) {
    const post = await this.postRepo.findById(id);
    if (!post) return null;
    const comments = await this.commentRepo.findByPost(id);
    return { post, comments };
  }

  async createPost(userId, { title, content }) {
    const postId = await this.postRepo.create({ userId, title, content });
    return this.postRepo.findById(postId);
  }

  async updatePost(post, userId, { title, content }, userRoles) {
    const isOwner = post.user_id === userId;
    const isAdmin = userRoles.includes('ADMIN');
    if (!isOwner && !isAdmin) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    await this.postRepo.update(post.id, { title, content });
    return this.postRepo.findById(post.id);
  }

  async deletePost(post, userId, userRoles) {
    const isOwner = post.user_id === userId;
    const isAdmin = userRoles.includes('ADMIN');
    if (!isOwner && !isAdmin) {
      const error = new Error('Forbidden');
      error.statusCode = 403;
      throw error;
    }
    await this.postRepo.delete(post.id);
  }

  async addComment(postId, userId, { content }) {
    const commentId = await this.commentRepo.create({ postId, userId, content });
    const comments = await this.commentRepo.findByPost(postId);
    return comments.find(c => c.id === commentId);
  }

  async toggleLike(postId, userId) {
    const alreadyLiked = await this.likeRepo.hasUserLiked(postId, userId);
    if (alreadyLiked) {
      await this.likeRepo.unlike(postId, userId);
      return { liked: false };
    } else {
      await this.likeRepo.like(postId, userId);
      return { liked: true };
    }
  }
}

module.exports = PostService;
