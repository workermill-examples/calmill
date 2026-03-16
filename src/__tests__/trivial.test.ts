import { describe, it, expect } from "vitest";

describe("Project Scaffold", () => {
  it("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should verify that environment is set up correctly", () => {
    expect(typeof process.env).toBe("object");
  });

  it("should verify that basic arithmetic works", () => {
    const result = [1, 2, 3].reduce((acc, num) => acc + num, 0);
    expect(result).toBe(6);
  });
});

describe("Basic TypeScript Features", () => {
  it("should handle string operations", () => {
    const message = "Hello, CalMill!";
    expect(message.toUpperCase()).toBe("HELLO, CALMILL!");
    expect(message.includes("CalMill")).toBe(true);
  });

  it("should handle array operations", () => {
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map((n) => n * 2);
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
  });

  it("should handle object operations", () => {
    const user = { name: "Test User", email: "test@example.com" };
    expect(user.name).toBe("Test User");
    expect(Object.keys(user)).toEqual(["name", "email"]);
  });
});
