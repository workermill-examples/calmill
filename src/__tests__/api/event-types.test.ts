// Event Types API Tests
// Test the event types CRUD operations

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    eventType: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    schedule: {
      findFirst: vi.fn(),
    },
    booking: {
      count: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/event-types/route";
import {
  GET as getEventType,
  PUT,
  DELETE,
} from "@/app/api/event-types/[id]/route";
import { PATCH } from "@/app/api/event-types/[id]/toggle/route";

const mockAuth = auth as any;
const mockPrisma = prisma as any;

describe("Event Types API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/event-types", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/event-types");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should return user event types", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findMany.mockResolvedValue([
        {
          id: "et1",
          title: "Test Meeting",
          slug: "test-meeting",
          duration: 30,
          isActive: true,
          schedule: null,
          _count: { bookings: 5 },
        },
      ]);

      const request = new NextRequest("http://localhost:3000/api/event-types");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventTypes).toHaveLength(1);
      expect(data.eventTypes[0].title).toBe("Test Meeting");
      expect(data.eventTypes[0].bookingCount).toBe(5);
      expect(mockPrisma.eventType.findMany).toHaveBeenCalledWith({
        where: { userId: "user1", isActive: true },
        include: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });

    it("should include inactive event types when requested", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findMany.mockResolvedValue([]);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types?includeInactive=true",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.eventType.findMany).toHaveBeenCalledWith({
        where: { userId: "user1" },
        include: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });
  });

  describe("POST /api/event-types", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/event-types", {
        method: "POST",
        body: JSON.stringify({ title: "Test", slug: "test", duration: 30 }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should create a new event type", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findUnique.mockResolvedValue(null);
      mockPrisma.eventType.create.mockResolvedValue({
        id: "et1",
        title: "Test Meeting",
        slug: "test-meeting",
        duration: 30,
        schedule: null,
      });

      const requestData = {
        title: "Test Meeting",
        slug: "test-meeting",
        duration: 30,
      };

      const request = new NextRequest("http://localhost:3000/api/event-types", {
        method: "POST",
        body: JSON.stringify(requestData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.eventType.title).toBe("Test Meeting");
      expect(mockPrisma.eventType.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "Test Meeting",
          slug: "test-meeting",
          duration: 30,
          userId: "user1",
        }),
        include: expect.any(Object),
      });
    });

    it("should reject duplicate slugs", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findUnique.mockResolvedValue({ id: "existing" });

      const requestData = {
        title: "Test Meeting",
        slug: "existing-slug",
        duration: 30,
      };

      const request = new NextRequest("http://localhost:3000/api/event-types", {
        method: "POST",
        body: JSON.stringify(requestData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("conflict");
    });

    it("should validate input data", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });

      const requestData = {
        title: "",
        slug: "invalid slug!",
        duration: -1,
      };

      const request = new NextRequest("http://localhost:3000/api/event-types", {
        method: "POST",
        body: JSON.stringify(requestData),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("validation_error");
      expect(data.details).toBeDefined();
    });
  });

  describe("GET /api/event-types/[id]", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1",
      );
      const response = await getEventType(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should return event type details", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue({
        id: "et1",
        title: "Test Meeting",
        customQuestions: null,
        _count: { bookings: 3 },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1",
      );
      const response = await getEventType(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventType.title).toBe("Test Meeting");
      expect(data.eventType.bookingCount).toBe(3);
    });

    it("should return 404 for non-existent event type", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/nonexistent",
      );
      const response = await getEventType(request, {
        params: Promise.resolve({ id: "nonexistent" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });
  });

  describe("PATCH /api/event-types/[id]/toggle", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1/toggle",
        { method: "PATCH" },
      );
      const response = await PATCH(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should toggle event type active status", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue({
        id: "et1",
        isActive: true,
      });
      mockPrisma.booking.count.mockResolvedValue(0);
      mockPrisma.eventType.update.mockResolvedValue({
        id: "et1",
        isActive: false,
        customQuestions: null,
        _count: { bookings: 0 },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1/toggle",
        { method: "PATCH" },
      );
      const response = await PATCH(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.eventType.isActive).toBe(false);
      expect(data.message).toContain("deactivated");
    });

    it("should prevent deactivating event type with active bookings", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue({
        id: "et1",
        isActive: true,
      });
      mockPrisma.booking.count.mockResolvedValue(3);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1/toggle",
        { method: "PATCH" },
      );
      const response = await PATCH(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("conflict");
      expect(data.details.activeBookings).toBe(3);
    });
  });

  describe("DELETE /api/event-types/[id]", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1",
        { method: "DELETE" },
      );
      const response = await DELETE(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should delete event type without active bookings", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue({
        id: "et1",
        title: "Test Meeting",
      });
      mockPrisma.booking.count.mockResolvedValue(0);
      mockPrisma.eventType.delete.mockResolvedValue({});

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1",
        { method: "DELETE" },
      );
      const response = await DELETE(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("deleted successfully");
      expect(mockPrisma.eventType.delete).toHaveBeenCalledWith({
        where: { id: "et1" },
      });
    });

    it("should prevent deletion with active bookings", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user1" } });
      mockPrisma.eventType.findFirst.mockResolvedValue({
        id: "et1",
        title: "Test Meeting",
      });
      mockPrisma.booking.count.mockResolvedValue(2);

      const request = new NextRequest(
        "http://localhost:3000/api/event-types/et1",
        { method: "DELETE" },
      );
      const response = await DELETE(request, {
        params: Promise.resolve({ id: "et1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("conflict");
      expect(data.details.activeBookings).toBe(2);
    });
  });
});
