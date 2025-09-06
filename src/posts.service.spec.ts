import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(() => {
    postsService = new PostsService();
  });

  describe('.findMany', () => {
    const posts = [
      { text: 'Post 1' },
      { text: 'Post 2' },
      { text: 'Post 3' },
      { text: 'Post 4' },
    ];

    beforeEach(() => {
      posts.forEach((post) => postsService.create(post));
    });

    it('should return all posts if called without options', () => {
      const allNoArgs = postsService.findMany();
      expect(Array.isArray(allNoArgs)).toBe(true);
      expect(allNoArgs).toHaveLength(posts.length);

      allNoArgs.forEach((p, i) => {
        expect(p).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            text: posts[i].text,
          })
        );
      });

      const allEmptyOptions = postsService.findMany({});
      expect(allEmptyOptions).toHaveLength(posts.length);
      expect(allEmptyOptions.map((p) => p.text)).toEqual(
        posts.map((p) => p.text)
      );
    });

    it('should return correct posts for skip and limit options', () => {
      const result = postsService.findMany({ skip: 1, limit: 2 });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.text)).toEqual(['Post 2', 'Post 3']);

      result.forEach((p) => {
        expect(p).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            text: expect.any(String),
          })
        );
      });
    });

    it('should respect limit only', () => {
      const result = postsService.findMany({ limit: 3 });
      expect(result).toHaveLength(3);
      expect(result.map((p) => p.text)).toEqual(['Post 1', 'Post 2', 'Post 3']);
    });

    it('should respect skip only', () => {
      const result = postsService.findMany({ skip: 2 });
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.text)).toEqual(['Post 3', 'Post 4']);
    });

    it('should return empty array when limit is 0', () => {
      const result = postsService.findMany({ limit: 0 });
      expect(result).toEqual([]);
    });

    it('should not crash and return all available when limit exceeds total', () => {
      const result = postsService.findMany({ limit: 999 });
      expect(result).toHaveLength(4);
      expect(result.map((p) => p.text)).toEqual([
        'Post 1',
        'Post 2',
        'Post 3',
        'Post 4',
      ]);
    });

    it('should return empty array when skip is greater than or equal to total', () => {
      expect(postsService.findMany({ skip: 4 })).toEqual([]);
      expect(postsService.findMany({ skip: 100 })).toEqual([]);
    });

    it('should preserve original order of posts', () => {
      const result = postsService.findMany();
      expect(result.map((p) => p.text)).toEqual([
        'Post 1',
        'Post 2',
        'Post 3',
        'Post 4',
      ]);
    });
  });
});
