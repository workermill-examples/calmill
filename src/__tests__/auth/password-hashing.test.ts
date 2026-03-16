// Unit tests for password hashing with bcryptjs
// Tests password hashing and comparison

import { describe, it, expect } from "vitest";
import bcryptjs from "bcryptjs";

describe("Password Hashing", () => {
  it("should hash passwords with bcryptjs", async () => {
    const password = "test-password-123";
    const saltRounds = 12;

    const hash = await bcryptjs.hash(password, saltRounds);

    expect(hash).toBeDefined();
    expect(hash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    expect(hash).not.toBe(password);
  });

  it("should verify correct passwords", async () => {
    const password = "correct-password";
    const hash = await bcryptjs.hash(password, 10);

    const isValid = await bcryptjs.compare(password, hash);

    expect(isValid).toBe(true);
  });

  it("should reject incorrect passwords", async () => {
    const password = "correct-password";
    const wrongPassword = "wrong-password";
    const hash = await bcryptjs.hash(password, 10);

    const isValid = await bcryptjs.compare(wrongPassword, hash);

    expect(isValid).toBe(false);
  });

  it("should handle empty passwords", async () => {
    const emptyPassword = "";
    const hash = await bcryptjs.hash(emptyPassword, 10);

    const isValid = await bcryptjs.compare(emptyPassword, hash);

    expect(isValid).toBe(true);
  });

  it("should generate different hashes for same password", async () => {
    const password = "same-password";

    const hash1 = await bcryptjs.hash(password, 10);
    const hash2 = await bcryptjs.hash(password, 10);

    expect(hash1).not.toBe(hash2);
    expect(await bcryptjs.compare(password, hash1)).toBe(true);
    expect(await bcryptjs.compare(password, hash2)).toBe(true);
  });
});
