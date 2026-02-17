import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("facebook.getFeed", () => {
  beforeEach(() => {
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = "test-token-123";
    process.env.FACEBOOK_PAGE_ID = "test-page-id-456";
  });

  it("should return posts array when credentials are configured", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "post-1",
            message: "Test post 1",
            created_time: new Date().toISOString(),
            picture: "https://example.com/image.jpg",
          },
        ],
      }),
    });

    const result = await caller.facebook.getFeed();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.posts)).toBe(true);
  });

  it("should return error when credentials are missing", async () => {
    delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    delete process.env.FACEBOOK_PAGE_ID;

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.facebook.getFeed();

    expect(result.success).toBe(false);
    expect(result.posts).toEqual([]);
  });
});

describe("facebook.sharePost", () => {
  beforeEach(() => {
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = "test-token-123";
    process.env.FACEBOOK_PAGE_ID = "test-page-id-456";
  });

  it("should share a blog post to Facebook when authenticated", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "facebook-post-123",
      }),
    });

    const result = await caller.facebook.sharePost({
      postId: 1,
      title: "Test Article",
      excerpt: "This is a test article",
      image: "https://example.com/image.jpg",
      slug: "test-article",
    });

    expect(result.success).toBe(true);
    expect(result.facebookPostId).toBe("facebook-post-123");
  });

  it("should require authentication to share posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.facebook.sharePost({
        postId: 1,
        title: "Test Article",
        excerpt: "This is a test article",
        image: "https://example.com/image.jpg",
        slug: "test-article",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });
});
