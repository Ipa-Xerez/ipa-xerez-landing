import { eq, gte, lte, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, InsertEvent, Event, contacts, InsertContact, Contact } from "../drizzle/schema";
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
