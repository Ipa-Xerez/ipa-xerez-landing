import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Document Downloads Audit", () => {
  let documentId: number = 1;
  let memberId: number = 1;

  beforeAll(async () => {
    // Usar IDs válidos de documentos y miembros existentes
    // Documentos y miembros ya existen en la base de datos
    documentId = 1;
    memberId = 1;
  });

  it("should record a document download", async () => {
    const result = await db.recordDocumentDownload(
      documentId,
      memberId,
      "Test Member",
      "test@example.com"
    );
    expect(result).toBeDefined();
  });

  it("should get document downloads", async () => {
    // Registrar una descarga
    await db.recordDocumentDownload(
      documentId,
      memberId,
      "Test Member",
      "test@example.com"
    );

    // Obtener descargas
    const downloads = await db.getDocumentDownloads(documentId);
    expect(downloads).toBeDefined();
    expect(Array.isArray(downloads)).toBe(true);
    expect(downloads.length).toBeGreaterThan(0);
  });

  it("should calculate download statistics", async () => {
    // Registrar múltiples descargas
    await db.recordDocumentDownload(
      documentId,
      memberId,
      "Test Member 1",
      "test1@example.com"
    );
    await db.recordDocumentDownload(
      documentId,
      memberId + 1,
      "Test Member 2",
      "test2@example.com"
    );

    // Obtener estadísticas
    const stats = await db.getDownloadStats(documentId);
    expect(stats).toBeDefined();
    expect(stats.totalDownloads).toBeGreaterThan(0);
    expect(stats.uniqueMembers).toBeGreaterThan(0);
  });

  it("should get all downloads history", async () => {
    const downloads = await db.getAllDownloadsHistory();
    expect(Array.isArray(downloads)).toBe(true);
  });

  it("should get member download history", async () => {
    // Registrar una descarga
    await db.recordDocumentDownload(
      documentId,
      memberId,
      "Test Member",
      "test@example.com"
    );

    // Obtener historial del miembro
    const history = await db.getMemberDownloadHistory(memberId);
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThan(0);
  });

  it("should record download with correct member information", async () => {
    const memberName = "John Doe";
    const memberEmail = "john@example.com";

    await db.recordDocumentDownload(
      documentId,
      memberId + 10,
      memberName,
      memberEmail
    );

    const history = await db.getMemberDownloadHistory(memberId + 10);
    const lastDownload = history[history.length - 1];

    expect(lastDownload.memberName).toBe(memberName);
    expect(lastDownload.memberEmail).toBe(memberEmail);
  });

  it("should track download timestamp", async () => {
    await db.recordDocumentDownload(
      documentId,
      memberId,
      "Test Member",
      "test@example.com"
    );

    const downloads = await db.getDocumentDownloads(documentId);
    const lastDownload = downloads[downloads.length - 1];

    expect(lastDownload.downloadedAt).toBeDefined();
    expect(typeof lastDownload.downloadedAt).toBe("object");
  });

  it("should handle multiple downloads from same member", async () => {
    const memberName = "Repeated Member";
    const memberEmail = "repeated@example.com";

    // Registrar múltiples descargas del mismo miembro
    await db.recordDocumentDownload(
      documentId,
      memberId,
      memberName,
      memberEmail
    );
    await db.recordDocumentDownload(
      documentId,
      memberId,
      memberName,
      memberEmail
    );

    const history = await db.getMemberDownloadHistory(memberId);
    const memberDownloads = history.filter(
      (d) => d.memberEmail === memberEmail
    );

    expect(memberDownloads.length).toBeGreaterThanOrEqual(2);
  });

  it("should return empty array for document with no downloads", async () => {
    // Usar un ID de documento que no tiene descargas
    const newDocId = 999;

    const downloads = await db.getDocumentDownloads(newDocId);
    expect(Array.isArray(downloads)).toBe(true);
    expect(downloads.length).toBe(0);
  });

  it("should correctly count unique members", async () => {
    // Usar un ID de documento válido
    const testDocId = 2;

    // Registrar descargas de 3 miembros diferentes
    await db.recordDocumentDownload(
      testDocId,
      100,
      "Member A",
      "a@example.com"
    );
    await db.recordDocumentDownload(
      testDocId,
      101,
      "Member B",
      "b@example.com"
    );
    await db.recordDocumentDownload(
      testDocId,
      102,
      "Member C",
      "c@example.com"
    );
    // Registrar otra descarga del mismo miembro
    await db.recordDocumentDownload(
      testDocId,
      100,
      "Member A",
      "a@example.com"
    );

    const stats = await db.getDownloadStats(testDocId);
    expect(stats.totalDownloads).toBeGreaterThanOrEqual(4);
    expect(stats.uniqueMembers).toBeGreaterThanOrEqual(3);
  });
});
