import { describe, expect, it, vi, beforeEach } from "vitest";
import * as facebookScheduler from "./services/facebookScheduler";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getScheduledFacebookShares: vi.fn(),
  getPendingFacebookShares: vi.fn(),
  getBlogPostById: vi.fn(),
  updateFacebookShare: vi.fn(),
  createFacebookShare: vi.fn(),
  getFacebookShareByPostId: vi.fn(),
}));

describe("Facebook Scheduler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = "test-token";
    process.env.FACEBOOK_PAGE_ID = "test-page-id";
  });

  describe("shareBlogPostToFacebook", () => {
    it("should successfully share a blog post to Facebook", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "facebook-post-123" }),
      });
      global.fetch = mockFetch;

      const result = await facebookScheduler.shareBlogPostToFacebook(
        1,
        "Test Article",
        "This is a test article",
        "https://example.com/image.jpg",
        "test-article"
      );

      expect(result.success).toBe(true);
      expect(result.facebookPostId).toBe("facebook-post-123");
    });

    it("should handle missing credentials", async () => {
      delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      delete process.env.FACEBOOK_PAGE_ID;

      const result = await facebookScheduler.shareBlogPostToFacebook(
        1,
        "Test Article",
        "This is a test article",
        "https://example.com/image.jpg",
        "test-article"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Facebook credentials");
    });

    it("should handle API errors", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        statusText: "Bad Request",
      });
      global.fetch = mockFetch;

      const result = await facebookScheduler.shareBlogPostToFacebook(
        1,
        "Test Article",
        "This is a test article",
        "https://example.com/image.jpg",
        "test-article"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Facebook API error");
    });
  });

  describe("autoShareBlogPost", () => {
    it("should schedule a post for later sharing", async () => {
      const mockCreateShare = vi.fn().mockResolvedValue({
        id: 1,
        blogPostId: 1,
        shareStatus: "scheduled",
      });

      vi.mocked(db.createFacebookShare).mockImplementation(mockCreateShare);

      await facebookScheduler.autoShareBlogPost(
        1,
        "Test Article",
        "This is a test article",
        "https://example.com/image.jpg",
        "test-article",
        30 // 30 minutes delay
      );

      expect(mockCreateShare).toHaveBeenCalled();
    });

    it("should share immediately when delay is 0", async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "facebook-post-123" }),
      });
      global.fetch = mockFetch;

      const result = await facebookScheduler.autoShareBlogPost(
        1,
        "Test Article",
        "This is a test article",
        "https://example.com/image.jpg",
        "test-article",
        0 // No delay
      );

      // The function doesn't return anything, but it should call shareBlogPostToFacebook
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("processScheduledShares", () => {
    it("should process scheduled shares that are due", async () => {
      const mockPost = {
        id: 1,
        title: "Test Article",
        excerpt: "Test excerpt",
        content: "Test content",
        slug: "test-article",
        image: "https://example.com/image.jpg",
        isPublished: 1,
      };

      const mockScheduledShare = {
        id: 1,
        blogPostId: 1,
        shareStatus: "scheduled",
        scheduledFor: new Date(),
      };

      vi.mocked(db.getScheduledFacebookShares).mockResolvedValue([
        mockScheduledShare,
      ]);
      vi.mocked(db.getBlogPostById).mockResolvedValue(mockPost);

      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "facebook-post-123" }),
      });
      global.fetch = mockFetch;

      await facebookScheduler.processScheduledShares();

      expect(db.getScheduledFacebookShares).toHaveBeenCalled();
      expect(db.getBlogPostById).toHaveBeenCalledWith(1);
    });

    it("should handle missing blog posts", async () => {
      const mockScheduledShare = {
        id: 1,
        blogPostId: 999,
        shareStatus: "scheduled",
        scheduledFor: new Date(),
      };

      vi.mocked(db.getScheduledFacebookShares).mockResolvedValue([
        mockScheduledShare,
      ]);
      vi.mocked(db.getBlogPostById).mockResolvedValue(null);
      vi.mocked(db.updateFacebookShare).mockResolvedValue({
        id: 1,
        shareStatus: "failed",
      });

      await facebookScheduler.processScheduledShares();

      expect(db.updateFacebookShare).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          shareStatus: "failed",
          errorMessage: "Blog post not found",
        })
      );
    });
  });

  describe("startFacebookScheduler", () => {
    it("should return an interval", () => {
      const interval = facebookScheduler.startFacebookScheduler();
      expect(interval).toBeDefined();
      facebookScheduler.stopFacebookScheduler(interval);
    });
  });
});
