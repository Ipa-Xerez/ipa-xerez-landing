import { eq, gte, lte, and, count, desc, or, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, InsertEvent, Event, contacts, InsertContact, Contact, newsletterSubscribers, InsertNewsletterSubscriber, NewsletterSubscriber, newsletterCampaigns, InsertNewsletterCampaign, NewsletterCampaign, unsubscribeTokens, InsertUnsubscribeToken, UnsubscribeToken, newsletterOpens, newsletterClicks, blogPosts, BlogPost, InsertBlogPost, administrators, Administrator, InsertAdministrator, eventRegistrations, InsertEventRegistration, EventRegistration, ipaMembers, InsertIpaMember, IpaMember, privateDocuments, InsertPrivateDocument, PrivateDocument, memberAccessLogs, InsertMemberAccessLog } from "../drizzle/schema";
import { ENV } from './_core/env';


let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Events queries
export async function getEvents(startDate?: Date, endDate?: Date): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get events: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(events);
    
    if (startDate && endDate) {
      query = query.where(gte(events.date, startDate)).where(lte(events.date, endDate));
    }
    
    const result = await query.orderBy(events.date);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get events:", error);
    return [];
  }
}

export async function createEvent(event: InsertEvent): Promise<Event | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create event: database not available");
    return null;
  }

  try {
    const result = await db.insert(events).values(event);
    const newEvent = await db.select().from(events).where(eq(events.id, result[0].insertId as number)).limit(1);
    return newEvent.length > 0 ? newEvent[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create event:", error);
    throw error;
  }
}

export async function updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update event: database not available");
    return null;
  }

  try {
    await db.update(events).set(event).where(eq(events.id, id));
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update event:", error);
    throw error;
  }
}

export async function deleteEvent(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete event: database not available");
    return false;
  }

  try {
    await db.delete(events).where(eq(events.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete event:", error);
    throw error;
  }
}

export async function getEventsByMonth(year: number, month: number): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get events: database not available");
    return [];
  }

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const result = await db.select().from(events).where(
      and(
        gte(events.date, startDate),
        lte(events.date, endDate)
      )
    );
    
    return result.sort((a: Event, b: Event) => a.date.getTime() - b.date.getTime());
  } catch (error) {
    console.error("[Database] Failed to get events by month:", error);
    return [];
  }
}


// Contact queries
export async function createContact(contact: InsertContact): Promise<Contact | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact: database not available");
    return null;
  }

  try {
    const result = await db.insert(contacts).values(contact);
    const newContact = await db.select().from(contacts).where(eq(contacts.id, result[0].insertId as number)).limit(1);
    return newContact.length > 0 ? newContact[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create contact:", error);
    throw error;
  }
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts: database not available");
    return [];
  }

  try {
    const result = await db.select().from(contacts).orderBy(contacts.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contacts:", error);
    return [];
  }
}

// Newsletter Subscribers queries
export async function subscribeToNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot subscribe to newsletter: database not available");
    return null;
  }

  try {
    const result = await db.insert(newsletterSubscribers).values(subscriber);
    const newSubscriber = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, result[0].insertId as number)).limit(1);
    return newSubscriber.length > 0 ? newSubscriber[0] : null;
  } catch (error) {
    console.error("[Database] Failed to subscribe to newsletter:", error);
    throw error;
  }
}

export async function getNewsletterSubscribers(status: string = "subscribed"): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get newsletter subscribers: database not available");
    return [];
  }

  try {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.status, status as any)).orderBy(newsletterSubscribers.subscribedAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get newsletter subscribers:", error);
    return [];
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot unsubscribe from newsletter: database not available");
    return false;
  }

  try {
    await db.update(newsletterSubscribers).set({ status: "unsubscribed", unsubscribedAt: new Date() }).where(eq(newsletterSubscribers.email, email));
    return true;
  } catch (error) {
    console.error("[Database] Failed to unsubscribe from newsletter:", error);
    return false;
  }
}

// Newsletter Campaigns queries
export async function createNewsletterCampaign(campaign: InsertNewsletterCampaign): Promise<NewsletterCampaign | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create newsletter campaign: database not available");
    return null;
  }

  try {
    const result = await db.insert(newsletterCampaigns).values(campaign);
    const newCampaign = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.id, result[0].insertId as number)).limit(1);
    return newCampaign.length > 0 ? newCampaign[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create newsletter campaign:", error);
    throw error;
  }
}

export async function getNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get newsletter campaigns: database not available");
    return [];
  }

  try {
    const result = await db.select().from(newsletterCampaigns).orderBy(newsletterCampaigns.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get newsletter campaigns:", error);
    return [];
  }
}

export async function updateNewsletterCampaign(id: number, campaign: Partial<InsertNewsletterCampaign>): Promise<NewsletterCampaign | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update newsletter campaign: database not available");
    return null;
  }

  try {
    await db.update(newsletterCampaigns).set(campaign).where(eq(newsletterCampaigns.id, id));
    const result = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update newsletter campaign:", error);
    return null;
  }
}

// Unsubscribe tokens queries
export async function createUnsubscribeToken(subscriberId: number, token: string): Promise<UnsubscribeToken | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create unsubscribe token: database not available");
    return null;
  }

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Token válido por 30 días

    const result = await db.insert(unsubscribeTokens).values({
      subscriberId,
      token,
      expiresAt,
    });

    const newToken = await db.select().from(unsubscribeTokens).where(eq(unsubscribeTokens.id, result[0].insertId as number)).limit(1);
    return newToken.length > 0 ? newToken[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create unsubscribe token:", error);
    throw error;
  }
}

export async function getUnsubscribeToken(token: string): Promise<UnsubscribeToken | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get unsubscribe token: database not available");
    return null;
  }

  try {
    const result = await db.select().from(unsubscribeTokens).where(eq(unsubscribeTokens.token, token)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get unsubscribe token:", error);
    return null;
  }
}

export async function deleteUnsubscribeToken(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete unsubscribe token: database not available");
    return false;
  }

  try {
    await db.delete(unsubscribeTokens).where(eq(unsubscribeTokens.token, token));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete unsubscribe token:", error);
    return false;
  }
}

export async function unsubscribeFromNewsletterById(subscriberId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot unsubscribe: database not available");
    return false;
  }

  try {
    await db.update(newsletterSubscribers).set({ status: "unsubscribed" }).where(eq(newsletterSubscribers.id, subscriberId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to unsubscribe:", error);
    return false;
  }
}

// Newsletter Statistics queries
export async function getNewsletterStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get newsletter stats: database not available");
    return null;
  }

  try {
    const totalSubscribers = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "subscribed"));
    const totalCampaigns = await db.select({ count: count() }).from(newsletterCampaigns).where(eq(newsletterCampaigns.status, "sent"));
    const totalOpens = await db.select({ count: count() }).from(newsletterOpens);
    const totalClicks = await db.select({ count: count() }).from(newsletterClicks);

    return {
      totalSubscribers: totalSubscribers[0]?.count || 0,
      totalCampaigns: totalCampaigns[0]?.count || 0,
      totalOpens: totalOpens[0]?.count || 0,
      totalClicks: totalClicks[0]?.count || 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get newsletter stats:", error);
    return null;
  }
}

export async function getCampaignStats(campaignId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get campaign stats: database not available");
    return null;
  }

  try {
    const campaign = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.id, campaignId)).limit(1);
    if (campaign.length === 0) return null;

    const opens = await db.select({ count: count() }).from(newsletterOpens).where(eq(newsletterOpens.campaignId, campaignId));
    const clicks = await db.select({ count: count() }).from(newsletterClicks).where(eq(newsletterClicks.campaignId, campaignId));

    const recipientCount = campaign[0].recipientCount || 0;
    const openRate = recipientCount > 0 ? (opens[0]?.count || 0) / recipientCount * 100 : 0;
    const clickRate = recipientCount > 0 ? (clicks[0]?.count || 0) / recipientCount * 100 : 0;

    return {
      ...campaign[0],
      openCount: opens[0]?.count || 0,
      clickCount: clicks[0]?.count || 0,
      openRate: parseFloat(openRate.toFixed(2)),
      clickRate: parseFloat(clickRate.toFixed(2)),
    };
  } catch (error) {
    console.error("[Database] Failed to get campaign stats:", error);
    return null;
  }
}

export async function getAllCampaignsStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get campaigns stats: database not available");
    return [];
  }

  try {
    const campaigns = await db.select().from(newsletterCampaigns).where(eq(newsletterCampaigns.status, "sent")).orderBy(newsletterCampaigns.sentAt);
    
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const opens = await db.select({ count: count() }).from(newsletterOpens).where(eq(newsletterOpens.campaignId, campaign.id));
        const clicks = await db.select({ count: count() }).from(newsletterClicks).where(eq(newsletterClicks.campaignId, campaign.id));

        const recipientCount = campaign.recipientCount || 0;
        const openRate = recipientCount > 0 ? (opens[0]?.count || 0) / recipientCount * 100 : 0;
        const clickRate = recipientCount > 0 ? (clicks[0]?.count || 0) / recipientCount * 100 : 0;

        return {
          ...campaign,
          openCount: opens[0]?.count || 0,
          clickCount: clicks[0]?.count || 0,
          openRate: parseFloat(openRate.toFixed(2)),
          clickRate: parseFloat(clickRate.toFixed(2)),
        };
      })
    );

    return campaignsWithStats;
  } catch (error) {
    console.error("[Database] Failed to get campaigns stats:", error);
    return [];
  }
}


// ============ BLOG POSTS ============

export async function createBlogPost(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(blogPosts).values({
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      image: data.image,
      category: data.category,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      isPublished: data.isPublished ?? 1,
      publishedAt: data.publishedAt || new Date(),
    });
    return result;
  } catch (error) {
    console.error("[Blog] Error creating post:", error);
    throw error;
  }
}

export async function updateBlogPost(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content) updateData.content = data.content;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags) updateData.tags = JSON.stringify(data.tags);
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.publishedAt) updateData.publishedAt = data.publishedAt;

    const result = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
    return result;
  } catch (error) {
    console.error("[Blog] Error updating post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result;
  } catch (error) {
    console.error("[Blog] Error deleting post:", error);
    throw error;
  }
}

export async function getBlogPosts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, 1))
      .orderBy(desc(blogPosts.publishedAt));
    return posts;
  } catch (error) {
    console.error("[Blog] Error getting posts:", error);
    throw error;
  }
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const post = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, 1)))
      .limit(1);
    return post[0] || null;
  } catch (error) {
    console.error("[Blog] Error getting post by slug:", error);
    throw error;
  }
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return post[0] || null;
  } catch (error) {
    console.error("[Blog] Error getting post by id:", error);
    throw error;
  }
}

export async function getRecentBlogPosts(limit: number = 5) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, 1))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
    return posts;
  } catch (error) {
    console.error("[Blog] Error getting recent posts:", error);
    throw error;
  }
}

export async function searchBlogPosts(query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, 1),
          or(
            like(blogPosts.title, `%${query}%`),
            like(blogPosts.excerpt, `%${query}%`),
            like(blogPosts.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(blogPosts.publishedAt));
    return posts;
  } catch (error) {
    console.error("[Blog] Error searching posts:", error);
    throw error;
  }
}


// Administrator functions
export async function isUserAdmin(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    const admin = await db
      .select()
      .from(administrators)
      .where(eq(administrators.email, email))
      .limit(1);
    return admin.length > 0;
  } catch (error) {
    console.error("[Admin] Error checking admin status:", error);
    return false;
  }
}

export async function getAdministrator(email: string): Promise<Administrator | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const admin = await db
      .select()
      .from(administrators)
      .where(eq(administrators.email, email))
      .limit(1);
    return admin[0] || null;
  } catch (error) {
    console.error("[Admin] Error getting administrator:", error);
    throw error;
  }
}

export async function addAdministrator(data: InsertAdministrator): Promise<Administrator> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(administrators).values(data);
    const admin = await db
      .select()
      .from(administrators)
      .where(eq(administrators.id, result[0].insertId as any))
      .limit(1);
    return admin[0];
  } catch (error) {
    console.error("[Admin] Error adding administrator:", error);
    throw error;
  }
}

export async function getAllAdministrators(): Promise<Administrator[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.select().from(administrators);
  } catch (error) {
    console.error("[Admin] Error getting administrators:", error);
    throw error;
  }
}

export async function removeAdministrator(email: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(administrators).where(eq(administrators.email, email));
  } catch (error) {
    console.error("[Admin] Error removing administrator:", error);
    throw error;
  }
}




export async function getUpcomingEvents(limit: number = 10): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get upcoming events: database not available");
    return [];
  }

  try {
    const now = new Date();
    
    const result = await db
      .select()
      .from(events)
      .where(gte(events.date, now))
      .orderBy(events.date)
      .limit(limit);
    
    return result;
  } catch (error) {
    console.error("[Database] Failed to get upcoming events:", error);
    return [];
  }
}


// Event Registrations functions

export async function createEventRegistration(data: InsertEventRegistration): Promise<EventRegistration | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create event registration: database not available");
    return null;
  }

  try {
    const result = await db.insert(eventRegistrations).values(data);
    const registration = await db.select().from(eventRegistrations).where(eq(eventRegistrations.id, result[0].insertId as number)).limit(1);
    return registration.length > 0 ? registration[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create event registration:", error);
    throw error;
  }
}

export async function getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get event registrations: database not available");
    return [];
  }

  try {
    const result = await db.select().from(eventRegistrations).where(eq(eventRegistrations.eventId, eventId)).orderBy(eventRegistrations.registeredAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get event registrations:", error);
    return [];
  }
}

export async function getEventRegistrationsByEmail(email: string): Promise<EventRegistration[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get event registrations by email: database not available");
    return [];
  }

  try {
    const result = await db.select().from(eventRegistrations).where(eq(eventRegistrations.email, email)).orderBy(eventRegistrations.registeredAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get event registrations by email:", error);
    return [];
  }
}

export async function cancelEventRegistration(registrationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot cancel event registration: database not available");
    return false;
  }

  try {
    await db.update(eventRegistrations).set({ status: "cancelled", cancelledAt: new Date() }).where(eq(eventRegistrations.id, registrationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to cancel event registration:", error);
    throw error;
  }
}


// IPA Members queries
export async function importIpaMembers(members: Array<{ memberNumber: string; fullName: string }>): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot import IPA members: database not available");
    return 0;
  }

  try {
    let imported = 0;
    for (const member of members) {
      try {
        await db.insert(ipaMembers).values({
          memberNumber: member.memberNumber,
          fullName: member.fullName,
          status: "active",
        });
        imported++;
      } catch (error) {
        // Skip duplicates
        console.warn(`[Database] Skipping duplicate member: ${member.memberNumber}`);
      }
    }
    return imported;
  } catch (error) {
    console.error("[Database] Failed to import IPA members:", error);
    throw error;
  }
}

export async function getIpaMemberByNumber(memberNumber: string): Promise<IpaMember | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get IPA member: database not available");
    return null;
  }

  try {
    const result = await db.select().from(ipaMembers).where(eq(ipaMembers.memberNumber, memberNumber)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get IPA member:", error);
    return null;
  }
}

export async function getAllIpaMembers(): Promise<IpaMember[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get IPA members: database not available");
    return [];
  }

  try {
    const result = await db.select().from(ipaMembers).where(eq(ipaMembers.status, "active")).orderBy(ipaMembers.fullName);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get IPA members:", error);
    return [];
  }
}

// Private Documents queries
export async function createPrivateDocument(doc: InsertPrivateDocument): Promise<PrivateDocument | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create private document: database not available");
    return null;
  }

  try {
    const result = await db.insert(privateDocuments).values(doc);
    const newDoc = await db.select().from(privateDocuments).where(eq(privateDocuments.id, result[0].insertId as number)).limit(1);
    return newDoc.length > 0 ? newDoc[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create private document:", error);
    throw error;
  }
}

export async function getPrivateDocuments(membersOnly: boolean = true): Promise<PrivateDocument[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get private documents: database not available");
    return [];
  }

  try {
    const result = membersOnly
      ? await db.select().from(privateDocuments).where(eq(privateDocuments.isPublic, 0)).orderBy(privateDocuments.createdAt)
      : await db.select().from(privateDocuments).orderBy(privateDocuments.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get private documents:", error);
    return [];
  }
}

export async function getPrivateDocumentsByType(documentType: string): Promise<PrivateDocument[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get private documents: database not available");
    return [];
  }

  try {
    const result = await db.select().from(privateDocuments).where(eq(privateDocuments.documentType, documentType)).orderBy(privateDocuments.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get private documents:", error);
    return [];
  }
}

export async function logMemberAccess(memberId: number, documentId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot log member access: database not available");
    return false;
  }

  try {
    await db.insert(memberAccessLogs).values({
      memberId,
      documentId,
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to log member access:", error);
    return false;
  }
}
