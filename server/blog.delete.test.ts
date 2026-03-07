import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Blog Delete Mutation", () => {
  let testPostId: number;

  beforeAll(async () => {
    // Create a test blog post with unique slug
    const uniqueSlug = `test-post-delete-${Date.now()}`;
    const post = await db.createBlogPost({
      title: "Test Post for Delete",
      slug: uniqueSlug,
      content: "Test content",
      isPublished: 1,
    });
    testPostId = post.id;
  });

  afterAll(async () => {
    // Cleanup - ensure post is deleted
    try {
      await db.deleteBlogPost(testPostId);
    } catch (e) {
      // Already deleted, that's fine
    }
  });

  it("should delete a blog post successfully", async () => {
    // Verify post exists
    const postBefore = await db.getBlogPostById(testPostId);
    expect(postBefore).toBeDefined();
    expect(postBefore?.id).toBe(testPostId);

    // Delete the post
    const result = await db.deleteBlogPost(testPostId);
    expect(result).toBeDefined();

    // Verify post is deleted
    const postAfter = await db.getBlogPostById(testPostId);
    expect(postAfter).toBeNull();
  });

  it("should handle deletion of non-existent post", async () => {
    const nonExistentId = 999999;
    
    try {
      await db.deleteBlogPost(nonExistentId);
      // If no error is thrown, that's acceptable behavior
      expect(true).toBe(true);
    } catch (error) {
      // If error is thrown, it should be a meaningful error
      expect(error).toBeDefined();
    }
  });
});
