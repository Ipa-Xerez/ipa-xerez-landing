import { describe, expect, it, vi, beforeEach } from "vitest";
import * as facebookWebhookService from "./services/facebookWebhookService";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  logWebhookEvent: vi.fn(),
  getEngagementMetrics: vi.fn(),
  updateEngagementMetrics: vi.fn(),
  createEngagementMetrics: vi.fn(),
  getPendingFacebookShares: vi.fn(),
}));

describe("Facebook Webhook Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = "test-token";
  });

  describe("verifyWebhookSignature", () => {
    it("should verify a valid webhook signature", () => {
      const appSecret = "test-secret";
      const body = JSON.stringify({ test: "data" });
      const crypto = require("crypto");
      const hash = crypto
        .createHmac("sha256", appSecret)
        .update(body)
        .digest("hex");
      const signature = `sha256=${hash}`;

      const isValid = facebookWebhookService.verifyWebhookSignature(
        body,
        signature,
        appSecret
      );

      expect(isValid).toBe(true);
    });

    it("should reject an invalid webhook signature", () => {
      const appSecret = "test-secret";
      const body = JSON.stringify({ test: "data" });
      const invalidSignature = "sha256=invalid";

      const isValid = facebookWebhookService.verifyWebhookSignature(
        body,
        invalidSignature,
        appSecret
      );

      expect(isValid).toBe(false);
    });
  });

  describe("processFacebookWebhookEvent", () => {
    it("should process a valid webhook event", async () => {
      const mockLogEvent = vi.fn().mockResolvedValue({ id: 1 });
      vi.mocked(db.logWebhookEvent).mockImplementation(mockLogEvent);

      const payload = {
        entry: [
          {
            id: "123456",
            time: Date.now(),
            changes: [
              {
                field: "feed",
                value: {
                  post_id: "123456_789",
                  message: "Test post",
                },
              },
            ],
          },
        ],
      };

      await facebookWebhookService.processFacebookWebhookEvent(payload);

      expect(mockLogEvent).toHaveBeenCalled();
    });

    it("should handle invalid payload structure", async () => {
      const invalidPayload = {
        entry: null,
      };

      // Should not throw
      await expect(
        facebookWebhookService.processFacebookWebhookEvent(invalidPayload as any)
      ).resolves.not.toThrow();
    });

    it("should process comment changes", async () => {
      const mockLogEvent = vi.fn().mockResolvedValue({ id: 1 });
      vi.mocked(db.logWebhookEvent).mockImplementation(mockLogEvent);

      const payload = {
        entry: [
          {
            id: "123456",
            time: Date.now(),
            changes: [
              {
                field: "comments",
                value: {
                  parent_id: "123456_789",
                  comment_id: "comment_123",
                  message: "Great post!",
                },
              },
            ],
          },
        ],
      };

      await facebookWebhookService.processFacebookWebhookEvent(payload);

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "comments",
          facebookPostId: "123456_789",
        })
      );
    });

    it("should process reaction changes", async () => {
      const mockLogEvent = vi.fn().mockResolvedValue({ id: 1 });
      vi.mocked(db.logWebhookEvent).mockImplementation(mockLogEvent);

      const payload = {
        entry: [
          {
            id: "123456",
            time: Date.now(),
            changes: [
              {
                field: "reactions",
                value: {
                  post_id: "123456_789",
                  reaction: "LIKE",
                },
              },
            ],
          },
        ],
      };

      await facebookWebhookService.processFacebookWebhookEvent(payload);

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "reactions",
          facebookPostId: "123456_789",
        })
      );
    });

    it("should handle missing post ID gracefully", async () => {
      const mockLogEvent = vi.fn();
      vi.mocked(db.logWebhookEvent).mockImplementation(mockLogEvent);

      const payload = {
        entry: [
          {
            id: "123456",
            time: Date.now(),
            changes: [
              {
                field: "feed",
                value: {
                  message: "Test without post ID",
                },
              },
            ],
          },
        ],
      };

      await facebookWebhookService.processFacebookWebhookEvent(payload);

      // Should not log event without post ID
      expect(mockLogEvent).not.toHaveBeenCalled();
    });
  });

  describe("Engagement Metrics", () => {
    it("should log webhook events correctly", async () => {
      const mockLogEvent = vi.fn().mockResolvedValue({ id: 1 });
      vi.mocked(db.logWebhookEvent).mockImplementation(mockLogEvent);

      const payload = {
        entry: [
          {
            id: "123456",
            time: Date.now(),
            changes: [
              {
                field: "feed",
                value: {
                  post_id: "123456_789",
                  message: "Test post",
                },
              },
            ],
          },
        ],
      };

      await facebookWebhookService.processFacebookWebhookEvent(payload);

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: "feed",
          facebookPostId: "123456_789",
        })
      );
    });
  });
});
