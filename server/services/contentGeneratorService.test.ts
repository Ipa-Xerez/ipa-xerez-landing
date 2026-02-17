import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { generateNewsletterContent } from "./contentGeneratorService";

describe("contentGeneratorService", () => {
  it("should generate newsletter content with subject and HTML", async () => {
    const content = await generateNewsletterContent(15);

    expect(content).toBeDefined();
    expect(content.subject).toBeDefined();
    expect(content.subject).toContain("IPA Xerez Newsletter");
    expect(content.htmlContent).toBeDefined();
    expect(content.plainText).toBeDefined();
  });

  it("should include HTML structure in generated content", async () => {
    const content = await generateNewsletterContent(15);

    expect(content.htmlContent).toContain("<!DOCTYPE html>");
    expect(content.htmlContent).toContain("IPA Xerez");
    expect(content.htmlContent).toContain("Servo per Amikeco");
  });

  it("should include plain text version", async () => {
    const content = await generateNewsletterContent(15);

    expect(content.plainText).toContain("IPA XEREZ NEWSLETTER");
    expect(content.plainText).toContain("Servo per Amikeco");
  });

  it("should handle different time periods", async () => {
    const content7days = await generateNewsletterContent(7);
    const content30days = await generateNewsletterContent(30);

    expect(content7days.subject).toBeDefined();
    expect(content30days.subject).toBeDefined();
  });

  it("should include contact information in content", async () => {
    const content = await generateNewsletterContent(15);

    expect(content.htmlContent).toContain("ipaagrupacionxerez@gmail.com");
    expect(content.htmlContent).toContain("WhatsApp");
    expect(content.htmlContent).toContain("Facebook");
    expect(content.htmlContent).toContain("Instagram");
  });

  it("should include IPA branding in content", async () => {
    const content = await generateNewsletterContent(15);

    expect(content.htmlContent).toContain("#003366"); // IPA blue color
    expect(content.htmlContent).toContain("#D4AF37"); // IPA gold color
    expect(content.htmlContent).toContain("370.000+");
    expect(content.htmlContent).toContain("60+ Países");
  });
});
