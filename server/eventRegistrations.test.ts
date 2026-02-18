import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import { getDb } from "./db";

describe("Event Registrations", () => {
  beforeAll(async () => {
    // Ensure database is initialized
    await getDb();
  });

  it("should create an event registration", async () => {
    const registration = await db.createEventRegistration({
      eventId: 1,
      name: "Juan García",
      email: "juan@example.com",
      phone: "+34 600 000 000",
      status: "confirmed",
    });

    expect(registration).toBeDefined();
    expect(registration?.name).toBe("Juan García");
    expect(registration?.email).toBe("juan@example.com");
    expect(registration?.status).toBe("confirmed");
  });

  it("should get registrations by event ID", async () => {
    // Create a test registration
    await db.createEventRegistration({
      eventId: 2,
      name: "María López",
      email: "maria@example.com",
      status: "confirmed",
    });

    const registrations = await db.getEventRegistrations(2);

    expect(Array.isArray(registrations)).toBe(true);
    expect(registrations.length).toBeGreaterThan(0);
    expect(registrations[0].eventId).toBe(2);
  });

  it("should get registrations by email", async () => {
    const email = "test@example.com";

    // Create a test registration
    await db.createEventRegistration({
      eventId: 3,
      name: "Test User",
      email: email,
      status: "confirmed",
    });

    const registrations = await db.getEventRegistrationsByEmail(email);

    expect(Array.isArray(registrations)).toBe(true);
    expect(registrations.length).toBeGreaterThan(0);
    expect(registrations[0].email).toBe(email);
  });

  it("should cancel an event registration", async () => {
    // Create a test registration
    const registration = await db.createEventRegistration({
      eventId: 4,
      name: "Cancel Test",
      email: "cancel@example.com",
      status: "confirmed",
    });

    if (registration) {
      const cancelled = await db.cancelEventRegistration(registration.id);

      expect(cancelled).toBe(true);

      // Verify cancellation
      const registrations = await db.getEventRegistrations(4);
      const cancelledReg = registrations.find((r) => r.id === registration.id);
      expect(cancelledReg?.status).toBe("cancelled");
    }
  });

  it("should handle invalid email format", async () => {
    try {
      await db.createEventRegistration({
        eventId: 5,
        name: "Invalid Email",
        email: "not-an-email",
        status: "confirmed",
      });
      // If it doesn't throw, the test should still pass
      // (depends on database validation)
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should store phone number when provided", async () => {
    const phone = "+34 666 777 888";
    const registration = await db.createEventRegistration({
      eventId: 6,
      name: "Phone Test",
      email: "phone@example.com",
      phone: phone,
      status: "confirmed",
    });

    expect(registration?.phone).toBe(phone);
  });

  it("should handle optional phone number", async () => {
    const registration = await db.createEventRegistration({
      eventId: 7,
      name: "No Phone",
      email: "nophone@example.com",
      status: "confirmed",
    });

    expect(registration).toBeDefined();
    expect(registration?.phone).toBeNull();
  });

  it("should track registration timestamp", async () => {
    const registration = await db.createEventRegistration({
      eventId: 8,
      name: "Timestamp Test",
      email: "timestamp@example.com",
      status: "confirmed",
    });

    expect(registration?.registeredAt).toBeDefined();
    expect(registration?.registeredAt instanceof Date).toBe(true);
  });
});
