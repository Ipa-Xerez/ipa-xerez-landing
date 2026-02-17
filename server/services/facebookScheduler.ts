import * as db from "../db";
import { getDb } from "../db";
import { facebookShares } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const FACEBOOK_API_VERSION = "v18.0";
const FACEBOOK_GRAPH_URL = "https://graph.facebook.com";

/**
 * Share a blog post to Facebook
 */
export async function shareBlogPostToFacebook(
  blogPostId: number,
  title: string,
  excerpt: string,
  image?: string,
  slug?: string
): Promise<{ success: boolean; facebookPostId?: string; error?: string }> {
  try {
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    if (!pageAccessToken || !pageId) {
      throw new Error("Facebook credentials not configured");
    }

    const postUrl = `https://ipaxerez.es/blog/${slug || ""}`;
    const message = `${title}\n\n${excerpt}\n\n${postUrl}`;

    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${pageId}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        link: postUrl,
        picture: image,
        access_token: pageAccessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Update the share record
    const existingShare = await db.getFacebookShareByPostId(blogPostId);
    if (existingShare) {
      await db.updateFacebookShare(existingShare.id, {
        facebookPostId: result.id,
        shareStatus: "shared",
        sharedAt: new Date(),
      });
    }

    return {
      success: true,
      facebookPostId: result.id,
    };
  } catch (error) {
    console.error("[Facebook Scheduler] Error sharing post:", error);
    
    // Update the share record with error
    const existingShare = await db.getFacebookShareByPostId(blogPostId);
    if (existingShare) {
      await db.updateFacebookShare(existingShare.id, {
        shareStatus: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process all scheduled shares that are due
 */
export async function processScheduledShares(): Promise<void> {
  try {
    console.log("[Facebook Scheduler] Processing scheduled shares...");
    
    const scheduledShares = await db.getScheduledFacebookShares();
    
    if (scheduledShares.length === 0) {
      console.log("[Facebook Scheduler] No scheduled shares to process");
      return;
    }

    console.log(`[Facebook Scheduler] Found ${scheduledShares.length} shares to process`);

    for (const share of scheduledShares) {
      try {
        // Get the blog post details
        const post = await db.getBlogPostById(share.blogPostId);
        if (!post) {
          console.warn(`[Facebook Scheduler] Blog post ${share.blogPostId} not found`);
          await db.updateFacebookShare(share.id, {
            shareStatus: "failed",
            errorMessage: "Blog post not found",
          });
          continue;
        }

        // Share the post
        const result = await shareBlogPostToFacebook(
          post.id,
          post.title,
          post.excerpt || post.content.substring(0, 200),
          post.image || undefined,
          post.slug
        );

        if (result.success) {
          console.log(`[Facebook Scheduler] Successfully shared post ${post.id} to Facebook`);
        } else {
          console.error(`[Facebook Scheduler] Failed to share post ${post.id}: ${result.error}`);
        }
      } catch (error) {
        console.error(`[Facebook Scheduler] Error processing share ${share.id}:`, error);
        await db.updateFacebookShare(share.id, {
          shareStatus: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  } catch (error) {
    console.error("[Facebook Scheduler] Error processing scheduled shares:", error);
  }
}

/**
 * Auto-share a blog post immediately or schedule it for later
 */
export async function autoShareBlogPost(
  blogPostId: number,
  title: string,
  excerpt: string,
  image: string | undefined,
  slug: string,
  delayMinutes: number = 0
): Promise<void> {
  try {
    // Check if a share record already exists
    let existingShare = await db.getFacebookShareByPostId(blogPostId);

    if (delayMinutes > 0) {
      // Schedule for later
      const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
      
      if (existingShare) {
        await db.updateFacebookShare(existingShare.id, {
          shareStatus: "scheduled",
          scheduledFor: scheduledFor,
          autoShare: 1,
        });
      } else {
        await db.createFacebookShare({
          blogPostId,
          shareStatus: "scheduled",
          scheduledFor: scheduledFor,
          autoShare: 1,
        });
      }
      
      console.log(
        `[Facebook Scheduler] Post ${blogPostId} scheduled to share in ${delayMinutes} minutes`
      );
    } else {
      // Share immediately
      const result = await shareBlogPostToFacebook(
        blogPostId,
        title,
        excerpt,
        image,
        slug
      );

      if (!result.success) {
        console.error(`[Facebook Scheduler] Failed to auto-share post: ${result.error}`);
      }
    }
  } catch (error) {
    console.error("[Facebook Scheduler] Error auto-sharing blog post:", error);
  }
}

/**
 * Start the scheduler (runs every minute)
 */
export function startFacebookScheduler(): NodeJS.Timeout {
  console.log("[Facebook Scheduler] Starting scheduler...");
  
  // Process scheduled shares every minute
  const interval = setInterval(async () => {
    await processScheduledShares();
  }, 60 * 1000); // Every minute

  // Also run immediately on startup
  processScheduledShares();

  return interval;
}

/**
 * Stop the scheduler
 */
export function stopFacebookScheduler(interval: NodeJS.Timeout): void {
  console.log("[Facebook Scheduler] Stopping scheduler...");
  clearInterval(interval);
}
