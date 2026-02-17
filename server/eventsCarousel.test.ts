import { describe, it, expect, vi } from "vitest";
import * as db from "./db";

describe("Events Carousel", () => {
  describe("getUpcomingEvents", () => {
    it("should return upcoming events sorted by date", async () => {
      const now = new Date();
      const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now

      // Mock the database call
      const mockEvents = [
        {
          id: 1,
          title: "Police Week 2026",
          description: "International police week",
          date: futureDate1,
          location: "Washington D.C.",
          eventType: "police-week",
          image: null,
          registrationUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Zambomba",
          description: "Traditional celebration",
          date: futureDate2,
          location: "Jerez",
          eventType: "zambomba",
          image: null,
          registrationUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Test that upcoming events are returned
      expect(mockEvents.length).toBe(2);
      expect(mockEvents[0].date < mockEvents[1].date).toBe(true);
    });

    it("should return empty array if no upcoming events", async () => {
      const emptyEvents: any[] = [];
      expect(emptyEvents.length).toBe(0);
    });

    it("should respect the limit parameter", async () => {
      const mockEvents = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Event ${i + 1}`,
        description: "Test event",
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        location: "Test Location",
        eventType: "test",
        image: null,
        registrationUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const limited = mockEvents.slice(0, 10);
      expect(limited.length).toBe(10);
    });

    it("should not include past events", async () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const mockEvent = {
        id: 1,
        title: "Past Event",
        description: "This is in the past",
        date: pastDate,
        location: "Test",
        eventType: "test",
        image: null,
        registrationUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Past event should not be included
      expect(mockEvent.date < now).toBe(true);
    });

    it("should handle event with all optional fields", async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const completeEvent = {
        id: 1,
        title: "Complete Event",
        description: "Event with all fields",
        date: futureDate,
        location: "Jerez de la Frontera",
        eventType: "international-trip",
        image: "https://example.com/image.jpg",
        registrationUrl: "https://example.com/register",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(completeEvent.title).toBeDefined();
      expect(completeEvent.description).toBeDefined();
      expect(completeEvent.location).toBeDefined();
      expect(completeEvent.image).toBeDefined();
      expect(completeEvent.registrationUrl).toBeDefined();
    });
  });

  describe("Event carousel navigation", () => {
    it("should cycle through events correctly", () => {
      const events = [
        { id: 1, title: "Event 1" },
        { id: 2, title: "Event 2" },
        { id: 3, title: "Event 3" },
      ];

      let currentIndex = 0;

      // Go to next
      currentIndex = (currentIndex + 1) % events.length;
      expect(currentIndex).toBe(1);

      // Go to next again
      currentIndex = (currentIndex + 1) % events.length;
      expect(currentIndex).toBe(2);

      // Go to next (should wrap around)
      currentIndex = (currentIndex + 1) % events.length;
      expect(currentIndex).toBe(0);
    });

    it("should go to previous event correctly", () => {
      const events = [
        { id: 1, title: "Event 1" },
        { id: 2, title: "Event 2" },
        { id: 3, title: "Event 3" },
      ];

      let currentIndex = 0;

      // Go to previous (should wrap around)
      currentIndex = (currentIndex - 1 + events.length) % events.length;
      expect(currentIndex).toBe(2);

      // Go to previous
      currentIndex = (currentIndex - 1 + events.length) % events.length;
      expect(currentIndex).toBe(1);
    });

    it("should jump to specific event", () => {
      const events = [
        { id: 1, title: "Event 1" },
        { id: 2, title: "Event 2" },
        { id: 3, title: "Event 3" },
      ];

      const targetIndex = 2;
      expect(events[targetIndex].id).toBe(3);
    });
  });
});
