import { describe, it, expect } from "vitest";

/**
 * Test para validar que safeParseTags en Blog.tsx maneja correctamente:
 * - JSON arrays: ["tag1","tag2"]
 * - Comma-separated strings: "tag1,tag2,tag3"
 * - Fallback para valores inválidos
 */

// Simular la función safeParseTags del cliente
function safeParseTags(tagsValue: any): string[] {
  if (!tagsValue) return [];
  
  try {
    // If it's a string that looks like JSON array
    if (typeof tagsValue === 'string' && tagsValue.trim().startsWith('[')) {
      return JSON.parse(tagsValue);
    }
    // If it's a string with comma-separated values
    if (typeof tagsValue === 'string') {
      return tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    // If it's already an array
    if (Array.isArray(tagsValue)) {
      return tagsValue;
    }
  } catch (error) {
    console.warn('[Blog] Error parsing tags:', error, 'value:', tagsValue);
  }
  return [];
}

describe("Blog safeParseTags", () => {
  it("should parse JSON array format", () => {
    const jsonTags = '["Washington","Police Week","Viajes","Eventos Internacionales"]';
    const result = safeParseTags(jsonTags);
    
    expect(result).toEqual(["Washington", "Police Week", "Viajes", "Eventos Internacionales"]);
    expect(result.length).toBe(4);
  });

  it("should parse comma-separated string format", () => {
    const csvTags = "Washington,Police Week,Viajes,Eventos Internacionales";
    const result = safeParseTags(csvTags);
    
    expect(result).toEqual(["Washington", "Police Week", "Viajes", "Eventos Internacionales"]);
    expect(result.length).toBe(4);
  });

  it("should handle comma-separated with spaces", () => {
    const csvTags = "tag1 , tag2 , tag3";
    const result = safeParseTags(csvTags);
    
    expect(result).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle empty strings", () => {
    expect(safeParseTags("")).toEqual([]);
    expect(safeParseTags(null)).toEqual([]);
    expect(safeParseTags(undefined)).toEqual([]);
  });

  it("should handle already parsed array", () => {
    const arrayTags = ["tag1", "tag2", "tag3"];
    const result = safeParseTags(arrayTags);
    
    expect(result).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle invalid JSON gracefully", () => {
    const invalidJson = '[invalid json';
    const result = safeParseTags(invalidJson);
    
    // Should not crash, should return empty array or fallback
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter empty tags", () => {
    const csvTags = "tag1,,tag2,,tag3";
    const result = safeParseTags(csvTags);
    
    expect(result).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle single tag", () => {
    expect(safeParseTags("single-tag")).toEqual(["single-tag"]);
    expect(safeParseTags('["single-tag"]')).toEqual(["single-tag"]);
  });
});
