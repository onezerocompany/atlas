import { describe, it, expect } from "bun:test";
import { validateUnderscoreName } from "../../src/validators/underscore_name";

describe("validateUnderscoreName", () => {
  it("should return true for valid names", () => {
    expect(validateUnderscoreName("valid_name")).toBe(true);
    expect(validateUnderscoreName("another_valid_name_123")).toBe(true);
    expect(validateUnderscoreName("yet_another_VALID_name")).toBe(true);
  });

  it("should return false for invalid names", () => {
    expect(validateUnderscoreName("invalid-name")).toBe(false);
    expect(validateUnderscoreName("invalid name")).toBe(false);
    expect(validateUnderscoreName("invalid$name")).toBe(false);
    expect(validateUnderscoreName("invalid/name")).toBe(false);
    expect(validateUnderscoreName("invalid\nname")).toBe(false);
  });

  it("should return false for names with leading/trailing spaces", () => {
    expect(validateUnderscoreName(" valid_name")).toBe(false);
    expect(validateUnderscoreName("valid_name ")).toBe(false);
    expect(validateUnderscoreName(" valid_name ")).toBe(false);
  });
});
