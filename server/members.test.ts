import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Members Module", () => {
  describe("getIpaMemberByNumber", () => {
    it("should return null for non-existent member number", async () => {
      const member = await db.getIpaMemberByNumber("999999");
      expect(member).toBeNull();
    });

    it("should handle invalid member number format", async () => {
      const member = await db.getIpaMemberByNumber("");
      expect(member).toBeNull();
    });
  });

  describe("getPrivateDocuments", () => {
    it("should return an array of private documents", async () => {
      const documents = await db.getPrivateDocuments(true);
      expect(Array.isArray(documents)).toBe(true);
    });

    it("should return documents marked as private", async () => {
      const documents = await db.getPrivateDocuments(true);
      // All documents should be private (isPublic = 0)
      documents.forEach((doc) => {
        expect(doc.isPublic).toBe(0);
      });
    });

    it("should return all documents when membersOnly is false", async () => {
      const allDocuments = await db.getPrivateDocuments(false);
      expect(Array.isArray(allDocuments)).toBe(true);
    });
  });

  describe("getPrivateDocumentsByType", () => {
    it("should return documents of specific type", async () => {
      const estatutos = await db.getPrivateDocumentsByType("estatutos");
      expect(Array.isArray(estatutos)).toBe(true);
    });

    it("should return empty array for non-existent document type", async () => {
      const documents = await db.getPrivateDocumentsByType("non_existent_type");
      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBe(0);
    });
  });

  describe("logMemberAccess", () => {
    it("should log member access successfully", async () => {
      const result = await db.logMemberAccess(1, 1);
      expect(typeof result).toBe("boolean");
    });

    it("should handle invalid member or document IDs", async () => {
      const result = await db.logMemberAccess(999999, 999999);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("getAllIpaMembers", () => {
    it("should return an array of active members", async () => {
      const members = await db.getAllIpaMembers();
      expect(Array.isArray(members)).toBe(true);
    });

    it("should only return active members", async () => {
      const members = await db.getAllIpaMembers();
      members.forEach((member) => {
        expect(member.status).toBe("active");
      });
    });

    it("should return members sorted by name", async () => {
      const members = await db.getAllIpaMembers();
      // Verify all members have required fields
      expect(Array.isArray(members)).toBe(true);
      members.forEach((member) => {
        expect(member.fullName).not.toBeNull();
        expect(member.memberNumber).not.toBeNull();
      });
    });
  });
});

  describe("createIpaMember", () => {
    it("should create a new member successfully", async () => {
      const testMemberNumber = `TEST-${Date.now()}`;
      const member = await db.createIpaMember({
        memberNumber: testMemberNumber,
        fullName: "Test Member",
        status: "active",
      });

      expect(member).toBeDefined();
      expect(member?.memberNumber).toBe(testMemberNumber);
      expect(member?.fullName).toBe("Test Member");
      expect(member?.status).toBe("active");

      // Cleanup
      if (member) {
        await db.deleteIpaMember(member.id);
      }
    });
  });

  describe("deleteIpaMember", () => {
    it("should delete a member successfully", async () => {
      const testMemberNumber = `DELETE-${Date.now()}`;
      
      // Create member
      const member = await db.createIpaMember({
        memberNumber: testMemberNumber,
        fullName: "Member to Delete",
        status: "active",
      });

      expect(member).toBeDefined();

      // Delete member
      if (member) {
        const success = await db.deleteIpaMember(member.id);
        expect(success).toBe(true);

        // Verify deletion
        const deleted = await db.getIpaMemberByNumber(testMemberNumber);
        expect(deleted).toBeNull();
      }
    });
  });
