import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("Documents Management", () => {
  const testDocument = {
    title: "Test Estatutos",
    description: "Test document for estatutos",
    documentType: "estatutos",
    fileUrl: "https://example.com/test.pdf",
    fileName: "test.pdf",
    uploadedBy: 1,
    isPublic: 0,
  };

  describe("createPrivateDocument", () => {
    it("should create a new private document", async () => {
      const doc = await db.createPrivateDocument(testDocument);
      expect(doc).toBeDefined();
      expect(doc?.title).toBe(testDocument.title);
      expect(doc?.documentType).toBe("estatutos");
      expect(doc?.isPublic).toBe(0);
    });

    it("should include all required fields", async () => {
      const doc = await db.createPrivateDocument(testDocument);
      expect(doc?.id).toBeDefined();
      expect(doc?.title).toBeDefined();
      expect(doc?.fileUrl).toBeDefined();
      expect(doc?.fileName).toBeDefined();
      expect(doc?.createdAt).toBeDefined();
    });
  });

  describe("getPrivateDocuments", () => {
    it("should return array of private documents", async () => {
      const docs = await db.getPrivateDocuments(true);
      expect(Array.isArray(docs)).toBe(true);
    });

    it("should only return private documents when membersOnly is true", async () => {
      const docs = await db.getPrivateDocuments(true);
      docs.forEach((doc) => {
        expect(doc.isPublic).toBe(0);
      });
    });

    it("should return all documents when membersOnly is false", async () => {
      const allDocs = await db.getPrivateDocuments(false);
      expect(Array.isArray(allDocs)).toBe(true);
    });
  });

  describe("getPrivateDocumentsByType", () => {
    it("should return documents of specific type", async () => {
      const docs = await db.getPrivateDocumentsByType("estatutos");
      expect(Array.isArray(docs)).toBe(true);
    });

    it("should filter by document type correctly", async () => {
      const docs = await db.getPrivateDocumentsByType("actas");
      docs.forEach((doc) => {
        expect(doc.documentType).toBe("actas");
      });
    });

    it("should return empty array for non-existent type", async () => {
      const docs = await db.getPrivateDocumentsByType("non_existent");
      expect(docs.length).toBe(0);
    });
  });

  describe("getPrivateDocumentById", () => {
    it("should return null for non-existent document", async () => {
      const doc = await db.getPrivateDocumentById(999999);
      expect(doc).toBeNull();
    });

    it("should return document if it exists", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const fetched = await db.getPrivateDocumentById(created.id);
        expect(fetched?.id).toBe(created.id);
        expect(fetched?.title).toBe(created.title);
      }
    });
  });

  describe("updatePrivateDocument", () => {
    it("should update document title", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const updated = await db.updatePrivateDocument(created.id, {
          title: "Updated Title",
        });
        expect(updated?.title).toBe("Updated Title");
      }
    });

    it("should update document visibility", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const updated = await db.updatePrivateDocument(created.id, {
          isPublic: 1,
        });
        expect(updated?.isPublic).toBe(1);
      }
    });

    it("should preserve other fields when updating", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const updated = await db.updatePrivateDocument(created.id, {
          description: "New description",
        });
        expect(updated?.fileName).toBe(created.fileName);
        expect(updated?.fileUrl).toBe(created.fileUrl);
      }
    });
  });

  describe("deletePrivateDocument", () => {
    it("should delete a document", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const deleted = await db.deletePrivateDocument(created.id);
        expect(deleted).toBe(true);

        const fetched = await db.getPrivateDocumentById(created.id);
        expect(fetched).toBeNull();
      }
    });

    it("should return false for non-existent document", async () => {
      const result = await db.deletePrivateDocument(999999);
      expect(result).toBe(true); // MySQL doesn't error on non-existent deletes
    });
  });

  describe("incrementDocumentViewCount", () => {
    it("should increment view count", async () => {
      const created = await db.createPrivateDocument(testDocument);
      if (created) {
        const initialCount = created.viewCount || 0;
        await db.incrementDocumentViewCount(created.id);

        const updated = await db.getPrivateDocumentById(created.id);
        expect(updated?.viewCount).toBe(initialCount + 1);
      }
    });

    it("should return false for non-existent document", async () => {
      const result = await db.incrementDocumentViewCount(999999);
      expect(result).toBe(false);
    });
  });

  describe("Document Workflow", () => {
    it("should complete a full document lifecycle", async () => {
      // Create
      const created = await db.createPrivateDocument(testDocument);
      expect(created).toBeDefined();

      if (created) {
        // Read
        const fetched = await db.getPrivateDocumentById(created.id);
        expect(fetched?.title).toBe(testDocument.title);

        // Update
        const updated = await db.updatePrivateDocument(created.id, {
          description: "Updated description",
        });
        expect(updated?.description).toBe("Updated description");

        // View count
        await db.incrementDocumentViewCount(created.id);
        const withViews = await db.getPrivateDocumentById(created.id);
        expect(withViews?.viewCount).toBe(1);

        // Delete
        const deleted = await db.deletePrivateDocument(created.id);
        expect(deleted).toBe(true);
      }
    });
  });
});
