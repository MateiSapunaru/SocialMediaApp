const PostService = require('../postService');

describe('PostService', () => {
  let postRepo, commentRepo, likeRepo, postService;

  beforeEach(() => {
    postRepo = { findAll: jest.fn(), findById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() };
    commentRepo = { findByPost: jest.fn(), create: jest.fn() };
    likeRepo = { hasUserLiked: jest.fn(), like: jest.fn(), unlike: jest.fn() };
    postService = new PostService(postRepo, commentRepo, likeRepo);
  });

  describe('updatePost', () => {
    const post = { id: 1, user_id: 10 };

    it('allows the owner to update their own post', async () => {
      postRepo.update.mockResolvedValue();
      postRepo.findById.mockResolvedValue({ ...post, title: 'new' });

      const result = await postService.updatePost(post, 10, { title: 'new', content: 'c' }, ['USER']);

      expect(postRepo.update).toHaveBeenCalledWith(1, { title: 'new', content: 'c' });
      expect(result.title).toBe('new');
    });

    it('allows an admin to update someone else\'s post', async () => {
      postRepo.update.mockResolvedValue();
      postRepo.findById.mockResolvedValue(post);

      await expect(
        postService.updatePost(post, 999, { title: 't', content: 'c' }, ['ADMIN'])
      ).resolves.toBeDefined();
      expect(postRepo.update).toHaveBeenCalled();
    });

    it('forbids a non-owner, non-admin from updating a post', async () => {
      await expect(
        postService.updatePost(post, 999, { title: 't', content: 'c' }, ['USER'])
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(postRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
    const post = { id: 1, user_id: 10 };

    it('forbids deleting someone else\'s post', async () => {
      await expect(postService.deletePost(post, 999, ['USER'])).rejects.toMatchObject({ statusCode: 403 });
      expect(postRepo.delete).not.toHaveBeenCalled();
    });

    it('allows the owner to delete their post', async () => {
      await postService.deletePost(post, 10, ['USER']);
      expect(postRepo.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleLike', () => {
    it('likes a post the user has not liked yet', async () => {
      likeRepo.hasUserLiked.mockResolvedValue(false);
      const result = await postService.toggleLike(1, 2);
      expect(likeRepo.like).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ liked: true });
    });

    it('unlikes a post the user already liked', async () => {
      likeRepo.hasUserLiked.mockResolvedValue(true);
      const result = await postService.toggleLike(1, 2);
      expect(likeRepo.unlike).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ liked: false });
    });
  });

  describe('getPostWithComments', () => {
    it('returns null when the post does not exist', async () => {
      postRepo.findById.mockResolvedValue(null);
      const result = await postService.getPostWithComments(1);
      expect(result).toBeNull();
      expect(commentRepo.findByPost).not.toHaveBeenCalled();
    });

    it('returns the post together with its comments', async () => {
      postRepo.findById.mockResolvedValue({ id: 1 });
      commentRepo.findByPost.mockResolvedValue([{ id: 1, content: 'hi' }]);
      const result = await postService.getPostWithComments(1);
      expect(result).toEqual({ post: { id: 1 }, comments: [{ id: 1, content: 'hi' }] });
    });
  });
});
