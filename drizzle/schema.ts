import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Events table for calendar
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }),
  eventType: varchar("eventType", { length: 50 }).notNull(), // 'police-week', 'puy-du-fou', 'zambomba', etc.
  image: text("image"), // URL to event image
  registrationUrl: text("registrationUrl"), // URL for registration
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
// Contact messages table
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// Newsletter subscribers table
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  status: mysqlEnum("status", ["subscribed", "unsubscribed", "bounced"]).default("subscribed").notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Newsletter campaigns table
export const newsletterCampaigns = mysqlTable("newsletter_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "scheduled", "sent", "failed"]).default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  recipientCount: int("recipientCount").default(0),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
export type InsertNewsletterCampaign = typeof newsletterCampaigns.$inferInsert;

// Unsubscribe tokens table
export const unsubscribeTokens = mysqlTable("unsubscribe_tokens", {
  id: int("id").autoincrement().primaryKey(),
  subscriberId: int("subscriber_id").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type UnsubscribeToken = typeof unsubscribeTokens.$inferSelect;
export type InsertUnsubscribeToken = typeof unsubscribeTokens.$inferInsert;

// Newsletter opens tracking table
export const newsletterOpens = mysqlTable("newsletter_opens", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull(),
  subscriberId: int("subscriber_id").notNull(),
  openedAt: timestamp("openedAt").defaultNow().notNull(),
});

export type NewsletterOpen = typeof newsletterOpens.$inferSelect;
export type InsertNewsletterOpen = typeof newsletterOpens.$inferInsert;

// Newsletter clicks tracking table
export const newsletterClicks = mysqlTable("newsletter_clicks", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaign_id").notNull(),
  subscriberId: int("subscriber_id").notNull(),
  clickedAt: timestamp("clickedAt").defaultNow().notNull(),
});

export type NewsletterClick = typeof newsletterClicks.$inferSelect;
export type InsertNewsletterClick = typeof newsletterClicks.$inferInsert;


// Newsletter schedule table for automated recurring newsletters
export const newsletterSchedules = mysqlTable("newsletter_schedules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  frequency: mysqlEnum("frequency", ["daily", "weekly", "biweekly", "monthly"]).notNull(), // biweekly = every 15 days
  dayOfWeek: int("dayOfWeek"), // 0-6 (0=Sunday, 5=Friday)
  hour: int("hour").notNull(), // 0-23
  minute: int("minute").default(0), // 0-59
  timezone: varchar("timezone", { length: 50 }).default("Europe/Madrid").notNull(),
  isActive: tinyint("isActive").default(1).notNull(),
  lastSentAt: timestamp("lastSentAt"),
  nextSendAt: timestamp("nextSendAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterSchedule = typeof newsletterSchedules.$inferSelect;
export type InsertNewsletterSchedule = typeof newsletterSchedules.$inferInsert;

// Newsletter template table for automated content generation
export const newsletterTemplates = mysqlTable("newsletter_templates", {
  id: int("id").autoincrement().primaryKey(),
  scheduleId: int("schedule_id").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  includeEvents: tinyint("includeEvents").default(1).notNull(),
  includePhotos: tinyint("includePhotos").default(1).notNull(),
  includeBlog: tinyint("includeBlog").default(1).notNull(),
  maxEvents: int("maxEvents").default(5),
  maxPhotos: int("maxPhotos").default(10),
  maxBlogPosts: int("maxBlogPosts").default(3),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterTemplate = typeof newsletterTemplates.$inferSelect;
export type InsertNewsletterTemplate = typeof newsletterTemplates.$inferInsert;


// Blog posts table
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }),
  image: text("image"), // URL to featured image
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array of tags
  isPublished: tinyint("isPublished").default(1).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Administrators table for access control
export const administrators = mysqlTable("administrators", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  permissions: varchar("permissions", { length: 255 }).default("blog,newsletter,events").notNull(), // comma-separated permissions
  addedBy: int("added_by"), // user ID of the admin who added this admin
  addedAt: timestamp("added_at").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Administrator = typeof administrators.$inferSelect;
export type InsertAdministrator = typeof administrators.$inferInsert;



// Event registrations table for event inscriptions
export const eventRegistrations = mysqlTable("event_registrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("event_id").notNull(),
  userId: int("user_id"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["registered", "confirmed", "cancelled", "attended"]).default("registered").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;


// IPA Members table for member access control
export const ipaMembers = mysqlTable("ipa_members", {
  id: int("id").autoincrement().primaryKey(),
  memberNumber: varchar("member_number", { length: 20 }).notNull().unique(), // IPA member number
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  joinDate: timestamp("join_date"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IpaMember = typeof ipaMembers.$inferSelect;
export type InsertIpaMember = typeof ipaMembers.$inferInsert;

// Private documents for members only
export const privateDocuments = mysqlTable("private_documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  documentType: varchar("document_type", { length: 50 }).notNull(), // 'statute', 'minutes', 'communication', 'guide', etc.
  fileUrl: text("file_url").notNull(), // URL to the document file
  fileName: varchar("file_name", { length: 255 }).notNull(),
  uploadedBy: int("uploaded_by"), // User ID who uploaded
  isPublic: tinyint("is_public").default(0).notNull(), // 0 = members only, 1 = public
  viewCount: int("view_count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrivateDocument = typeof privateDocuments.$inferSelect;
export type InsertPrivateDocument = typeof privateDocuments.$inferInsert;

// Member access logs
export const memberAccessLogs = mysqlTable("member_access_logs", {
  id: int("id").autoincrement().primaryKey(),
  memberId: int("member_id").notNull(),
  documentId: int("document_id").notNull(),
  accessedAt: timestamp("accessed_at").defaultNow().notNull(),
});

export type MemberAccessLog = typeof memberAccessLogs.$inferSelect;
export type InsertMemberAccessLog = typeof memberAccessLogs.$inferInsert;

// Document download history tracking
export const documentDownloads = mysqlTable("document_downloads", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("document_id").notNull(),
  memberId: int("member_id").notNull(),
  memberName: varchar("member_name", { length: 255 }).notNull(),
  memberEmail: varchar("member_email", { length: 320 }).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export type DocumentDownload = typeof documentDownloads.$inferSelect;
export type InsertDocumentDownload = typeof documentDownloads.$inferInsert;


// Gallery categories
export const galleryCategories = mysqlTable("gallery_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  displayOrder: int("display_order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type GalleryCategory = typeof galleryCategories.$inferSelect;
export type InsertGalleryCategory = typeof galleryCategories.$inferInsert;

// Gallery images
export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("category_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(), // S3 URL
  s3Key: varchar("s3_key", { length: 500 }), // S3 object key for deletion
  uploadedBy: int("uploaded_by"), // User ID who uploaded
  displayOrder: int("display_order").default(0).notNull(),
  viewCount: int("view_count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;
