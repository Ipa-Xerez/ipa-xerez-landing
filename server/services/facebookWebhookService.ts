import * as db from "../db";

interface FacebookWebhookPayload {
  entry: Array<{
    id: string;
    time: number;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      timestamp: number;
      message?: { text: string };
    }>;
    changes?: Array<{
      field: string;
      value: {
        post_id?: string;
        comment_id?: string;
        message?: string;
        item?: string;
        reaction?: string;
        parent_id?: string;
        verb?: string;
        object?: string;
        created_time?: number;
        from?: { id: string; name: string };
      };
    }>;
  }>;
}

/**
 * Process Facebook webhook events
 * Handles comments, reactions, and other engagement metrics
 */
export async function processFacebookWebhookEvent(payload: FacebookWebhookPayload): Promise<void> {
  console.log("[Facebook Webhook] Processing event:", JSON.stringify(payload, null, 2));

  try {
    if (!payload.entry || !Array.isArray(payload.entry)) {
      console.warn("[Facebook Webhook] Invalid payload structure");
      return;
    }

    for (const entry of payload.entry) {
      if (entry.changes && Array.isArray(entry.changes)) {
        for (const change of entry.changes) {
          await processChange(change, entry.id);
        }
      }
    }
  } catch (error) {
    console.error("[Facebook Webhook] Error processing event:", error);
    throw error;
  }
}

async function processChange(
  change: any,
  pageId: string
): Promise<void> {
  const { field, value } = change;

  console.log(`[Facebook Webhook] Processing change - Field: ${field}, Value:`, value);

  try {
    // Extract Facebook post ID from the value
    const facebookPostId = value.post_id || value.parent_id || value.object;

    if (!facebookPostId) {
      console.warn("[Facebook Webhook] No post ID found in change");
      return;
    }

    // Log the webhook event
    await db.logWebhookEvent({
      eventType: field, // 'feed', 'comments', 'reactions', etc.
      facebookPostId,
      eventData: JSON.stringify(value),
      processed: 0,
    });

    // Handle different types of changes
    switch (field) {
      case "feed":
        // Handle feed changes (new posts, edits, deletions)
        await handleFeedChange(facebookPostId, value);
        break;

      case "comments":
        // Handle comment changes
        await handleCommentChange(facebookPostId, value);
        break;

      case "reactions":
        // Handle reaction changes
        await handleReactionChange(facebookPostId, value);
        break;

      default:
        console.log(`[Facebook Webhook] Unhandled field type: ${field}`);
    }
  } catch (error) {
    console.error("[Facebook Webhook] Error processing change:", error);
    throw error;
  }
}

async function handleFeedChange(facebookPostId: string, value: any): Promise<void> {
  console.log(`[Facebook Webhook] Handling feed change for post ${facebookPostId}`);

  try {
    // Fetch current metrics from Facebook API
    const metrics = await fetchPostMetrics(facebookPostId);

    if (metrics) {
      // Update or create metrics in database
      const existing = await db.getEngagementMetrics(facebookPostId);

      if (existing) {
        await db.updateEngagementMetrics(facebookPostId, {
          likes: metrics.likes,
          comments: metrics.comments,
          shares: metrics.shares,
          reactions: JSON.stringify(metrics.reactions),
        });
      } else {
        // Try to find the share record to link metrics
        const shares = await db.getPendingFacebookShares();
        const share = shares.find((s) => s.facebookPostId === facebookPostId);

        if (share) {
          await db.createEngagementMetrics({
            facebookShareId: share.id,
            facebookPostId,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: metrics.shares,
            reactions: JSON.stringify(metrics.reactions),
          });
        }
      }
    }
  } catch (error) {
    console.error("[Facebook Webhook] Error handling feed change:", error);
  }
}

async function handleCommentChange(facebookPostId: string, value: any): Promise<void> {
  console.log(`[Facebook Webhook] Handling comment change for post ${facebookPostId}`);

  try {
    // Fetch updated comment count
    const metrics = await fetchPostMetrics(facebookPostId);

    if (metrics) {
      const existing = await db.getEngagementMetrics(facebookPostId);

      if (existing) {
        await db.updateEngagementMetrics(facebookPostId, {
          comments: metrics.comments,
        });
      }
    }
  } catch (error) {
    console.error("[Facebook Webhook] Error handling comment change:", error);
  }
}

async function handleReactionChange(facebookPostId: string, value: any): Promise<void> {
  console.log(`[Facebook Webhook] Handling reaction change for post ${facebookPostId}`);

  try {
    // Fetch updated reaction counts
    const metrics = await fetchPostMetrics(facebookPostId);

    if (metrics) {
      const existing = await db.getEngagementMetrics(facebookPostId);

      if (existing) {
        await db.updateEngagementMetrics(facebookPostId, {
          likes: metrics.likes,
          reactions: JSON.stringify(metrics.reactions),
        });
      }
    }
  } catch (error) {
    console.error("[Facebook Webhook] Error handling reaction change:", error);
  }
}

/**
 * Fetch post metrics from Facebook Graph API
 */
async function fetchPostMetrics(facebookPostId: string): Promise<{
  likes: number;
  comments: number;
  shares: number;
  reactions: Record<string, number>;
} | null> {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageAccessToken) {
    console.error("[Facebook Webhook] Facebook credentials not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookPostId}?fields=likes.summary(true).limit(0),comments.summary(true).limit(0),shares,reactions.summary(true).limit(0)&access_token=${pageAccessToken}`
    );

    if (!response.ok) {
      console.error(`[Facebook Webhook] API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    return {
      likes: data.likes?.summary?.total_count || 0,
      comments: data.comments?.summary?.total_count || 0,
      shares: data.shares?.count || 0,
      reactions: parseReactions(data.reactions),
    };
  } catch (error) {
    console.error("[Facebook Webhook] Error fetching post metrics:", error);
    return null;
  }
}

/**
 * Parse reaction data from Facebook API
 */
function parseReactions(reactionsData: any): Record<string, number> {
  const reactions: Record<string, number> = {
    LIKE: 0,
    LOVE: 0,
    HAHA: 0,
    WOW: 0,
    SAD: 0,
    ANGRY: 0,
  };

  if (reactionsData?.data && Array.isArray(reactionsData.data)) {
    for (const reaction of reactionsData.data) {
      if (reaction.type && reactions.hasOwnProperty(reaction.type)) {
        reactions[reaction.type]++;
      }
    }
  }

  return reactions;
}

/**
 * Verify Facebook webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", appSecret)
    .update(body)
    .digest("hex");

  return `sha256=${hash}` === signature;
}
