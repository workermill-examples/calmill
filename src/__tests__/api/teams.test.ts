// Team API Tests
// Test the team management operations

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    team: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    teamMember: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    eventType: {
      findFirst: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET as getTeams, POST as createTeam } from "@/app/api/teams/route";
import {
  GET as getTeam,
  PUT as updateTeam,
  DELETE as deleteTeam,
} from "@/app/api/teams/[slug]/route";
import {
  GET as getMembers,
  POST as inviteMember,
} from "@/app/api/teams/[slug]/members/route";
import {
  PUT as updateMember,
  DELETE as removeMember,
} from "@/app/api/teams/[slug]/members/[memberId]/route";
import { GET as getInvitations } from "@/app/api/teams/invitations/route";
import { POST as acceptInvitation } from "@/app/api/teams/invitations/[memberId]/accept/route";
import { POST as rejectInvitation } from "@/app/api/teams/invitations/[memberId]/reject/route";
import { GET as getPublicTeam } from "@/app/api/teams/[slug]/public/route";

const mockAuth = auth as any;
const mockPrisma = prisma as any;

describe("Teams API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/teams", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/teams");
      const response = await getTeams(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should return user teams successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.team.findMany.mockResolvedValue([
        {
          id: "team1",
          name: "Test Team",
          slug: "test-team",
          bio: "Test bio",
          logoUrl: "https://example.com/logo.png",
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: "member1",
              role: "OWNER",
              accepted: true,
              userId: "user1",
              user: {
                id: "user1",
                name: "Test User",
                email: "test@example.com",
                username: "testuser",
              },
            },
          ],
          eventTypes: [
            {
              id: "et1",
              title: "Meeting",
              slug: "meeting",
              duration: 30,
              isActive: true,
              schedulingType: null,
            },
          ],
          _count: { members: 1, eventTypes: 1 },
        },
      ]);

      const request = new NextRequest("http://localhost:3000/api/teams");
      const response = await getTeams(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teams).toHaveLength(1);
      expect(data.teams[0].name).toBe("Test Team");
      expect(data.teams[0].userRole).toBe("OWNER");
    });
  });

  describe("POST /api/teams", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/teams", {
        method: "POST",
        body: JSON.stringify({ name: "Test Team", slug: "test-team" }),
      });
      const response = await createTeam(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should create team successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.team.findUnique.mockResolvedValue(null); // Slug available
      mockPrisma.team.create.mockResolvedValue({
        id: "team1",
        name: "Test Team",
        slug: "test-team",
        bio: null,
        logoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          {
            id: "member1",
            role: "OWNER",
            accepted: true,
            userId: "user1",
            user: {
              id: "user1",
              name: "Test User",
              email: "test@example.com",
              username: "testuser",
            },
          },
        ],
        eventTypes: [],
        _count: { members: 1, eventTypes: 0 },
      });

      const request = new NextRequest("http://localhost:3000/api/teams", {
        method: "POST",
        body: JSON.stringify({ name: "Test Team", slug: "test-team" }),
      });
      const response = await createTeam(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.team.name).toBe("Test Team");
      expect(data.team.userRole).toBe("OWNER");
    });

    it("should reject duplicate slug", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.team.findUnique.mockResolvedValue({ id: "existing" }); // Slug taken

      const request = new NextRequest("http://localhost:3000/api/teams", {
        method: "POST",
        body: JSON.stringify({ name: "Test Team", slug: "test-team" }),
      });
      const response = await createTeam(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("conflict");
    });

    it("should validate input data", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });

      const request = new NextRequest("http://localhost:3000/api/teams", {
        method: "POST",
        body: JSON.stringify({ name: "", slug: "INVALID-SLUG" }),
      });
      const response = await createTeam(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("validation_error");
    });
  });

  describe("GET /api/teams/[slug]", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const response = await getTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should return 404 for non-member", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const response = await getTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });

    it("should return team details for member", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: "member1",
        role: "OWNER",
        accepted: true,
        team: {
          id: "team1",
          name: "Test Team",
          slug: "test-team",
          bio: null,
          logoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          members: [
            {
              id: "member1",
              role: "OWNER",
              accepted: true,
              userId: "user1",
              user: {
                id: "user1",
                name: "Test User",
                email: "test@example.com",
                username: "testuser",
              },
            },
          ],
          eventTypes: [],
          _count: { members: 1, eventTypes: 0 },
        },
      });

      const response = await getTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.team.name).toBe("Test Team");
    });
  });

  describe("PUT /api/teams/[slug]", () => {
    it("should require admin permissions", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue(null); // No admin membership

      const response = await updateTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team", {
          method: "PUT",
          body: JSON.stringify({ name: "Updated Team" }),
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("forbidden");
    });

    it("should update team successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: "member1",
        role: "OWNER",
        team: { id: "team1", slug: "test-team" },
      });
      mockPrisma.team.update.mockResolvedValue({
        id: "team1",
        name: "Updated Team",
        slug: "test-team",
        bio: null,
        logoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [],
        eventTypes: [],
        _count: { members: 1, eventTypes: 0 },
      });

      const response = await updateTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team", {
          method: "PUT",
          body: JSON.stringify({ name: "Updated Team" }),
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.team.name).toBe("Updated Team");
    });
  });

  describe("DELETE /api/teams/[slug]", () => {
    it("should require owner permissions", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      // Return null to simulate no OWNER permission
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const response = await deleteTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("forbidden");
    });

    it("should prevent deletion with active bookings", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        role: "OWNER",
        team: { id: "team1" },
      });
      mockPrisma.eventType.findFirst.mockResolvedValue({ id: "et1" }); // Has active bookings

      const response = await deleteTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("conflict");
    });

    it("should delete team successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        role: "OWNER",
        team: { id: "team1" },
      });
      mockPrisma.eventType.findFirst.mockResolvedValue(null); // No active bookings
      mockPrisma.team.delete.mockResolvedValue({});

      const response = await deleteTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("deleted successfully");
    });
  });

  describe("GET /api/teams/[slug]/members", () => {
    it("should require team membership", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const response = await getMembers(
        new NextRequest("http://localhost:3000/api/teams/test-team/members"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });

    it("should return team members", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({ id: "member1" });
      mockPrisma.teamMember.findMany.mockResolvedValue([
        {
          id: "member1",
          role: "OWNER",
          accepted: true,
          createdAt: new Date(),
          user: {
            id: "user1",
            name: "Owner",
            email: "owner@example.com",
            username: "owner",
          },
        },
      ]);

      const response = await getMembers(
        new NextRequest("http://localhost:3000/api/teams/test-team/members"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.members).toHaveLength(1);
      expect(data.members[0].role).toBe("OWNER");
    });
  });

  describe("POST /api/teams/[slug]/members", () => {
    it("should require admin permissions", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const response = await inviteMember(
        new NextRequest("http://localhost:3000/api/teams/test-team/members", {
          method: "POST",
          body: JSON.stringify({ email: "new@example.com" }),
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("forbidden");
    });

    it("should invite member successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        role: "OWNER",
        team: { id: "team1", name: "Test Team" },
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "user2",
        email: "new@example.com",
      });
      mockPrisma.teamMember.findUnique.mockResolvedValue(null); // No existing membership
      mockPrisma.teamMember.create.mockResolvedValue({
        id: "member2",
        role: "MEMBER",
        accepted: false,
        createdAt: new Date(),
        user: {
          id: "user2",
          name: "New User",
          email: "new@example.com",
          username: "newuser",
        },
      });

      const response = await inviteMember(
        new NextRequest("http://localhost:3000/api/teams/test-team/members", {
          method: "POST",
          body: JSON.stringify({ email: "new@example.com", role: "MEMBER" }),
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.member.role).toBe("MEMBER");
      expect(data.member.accepted).toBe(false);
    });

    it("should reject invitation of non-existent user", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        role: "OWNER",
        team: { id: "team1" },
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await inviteMember(
        new NextRequest("http://localhost:3000/api/teams/test-team/members", {
          method: "POST",
          body: JSON.stringify({ email: "notfound@example.com" }),
        }),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });
  });

  describe("GET /api/teams/invitations", () => {
    it("should require authentication", async () => {
      mockAuth.mockResolvedValue(null);

      const response = await getInvitations(
        new NextRequest("http://localhost:3000/api/teams/invitations"),
      );
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("unauthorized");
    });

    it("should return user invitations", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findMany.mockResolvedValue([
        {
          id: "invite1",
          role: "MEMBER",
          accepted: false,
          createdAt: new Date(),
          team: {
            id: "team1",
            name: "Test Team",
            slug: "test-team",
            logoUrl: null,
            bio: null,
            _count: { members: 2 },
          },
        },
      ]);

      const response = await getInvitations(
        new NextRequest("http://localhost:3000/api/teams/invitations"),
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.invitations).toHaveLength(1);
      expect(data.invitations[0].team.name).toBe("Test Team");
    });
  });

  describe("POST /api/teams/invitations/[memberId]/accept", () => {
    it("should accept invitation successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: "invite1",
        userId: "user1",
        accepted: false,
        team: { id: "team1", name: "Test Team" },
      });
      mockPrisma.teamMember.update.mockResolvedValue({
        id: "invite1",
        role: "MEMBER",
        accepted: true,
        createdAt: new Date(),
        team: {
          id: "team1",
          name: "Test Team",
          slug: "test-team",
          logoUrl: null,
          bio: null,
          _count: { members: 2, eventTypes: 1 },
        },
        user: {
          id: "user1",
          name: "Test User",
          email: "test@example.com",
          username: "testuser",
        },
      });

      const response = await acceptInvitation(
        new NextRequest(
          "http://localhost:3000/api/teams/invitations/invite1/accept",
          { method: "POST" },
        ),
        { params: Promise.resolve({ memberId: "invite1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.membership.accepted).toBe(true);
      expect(data.message).toContain("Successfully joined");
    });

    it("should handle non-existent invitation", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue(null);

      const response = await acceptInvitation(
        new NextRequest(
          "http://localhost:3000/api/teams/invitations/invalid/accept",
          { method: "POST" },
        ),
        { params: Promise.resolve({ memberId: "invalid" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });
  });

  describe("POST /api/teams/invitations/[memberId]/reject", () => {
    it("should reject invitation successfully", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user1", email: "test@example.com" },
      });
      mockPrisma.teamMember.findFirst.mockResolvedValue({
        id: "invite1",
        userId: "user1",
        accepted: false,
        team: { id: "team1", name: "Test Team", slug: "test-team" },
      });
      mockPrisma.teamMember.delete.mockResolvedValue({});

      const response = await rejectInvitation(
        new NextRequest(
          "http://localhost:3000/api/teams/invitations/invite1/reject",
          { method: "POST" },
        ),
        { params: Promise.resolve({ memberId: "invite1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("Successfully rejected");
    });
  });

  describe("GET /api/teams/[slug]/public", () => {
    it("should return public team info", async () => {
      mockPrisma.team.findUnique.mockResolvedValue({
        id: "team1",
        name: "Test Team",
        slug: "test-team",
        logoUrl: "https://example.com/logo.png",
        bio: "Public team",
        createdAt: new Date(),
        members: [
          {
            id: "member1",
            role: "OWNER",
            user: {
              id: "user1",
              name: "Owner",
              username: "owner",
              image: null,
            },
          },
        ],
        eventTypes: [
          {
            id: "et1",
            title: "Public Meeting",
            slug: "public-meeting",
            description: "A public meeting",
            duration: 30,
            color: "#3B82F6",
            schedulingType: null,
            requiresConfirmation: false,
            minimumNotice: 120,
            price: 0,
            currency: "USD",
          },
        ],
        _count: { members: 1, eventTypes: 1 },
      });

      const response = await getPublicTeam(
        new NextRequest("http://localhost:3000/api/teams/test-team/public"),
        { params: Promise.resolve({ slug: "test-team" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.team.name).toBe("Test Team");
      expect(data.team.members).toHaveLength(1);
      expect(data.team.eventTypes).toHaveLength(1);
    });

    it("should return 404 for non-existent team", async () => {
      mockPrisma.team.findUnique.mockResolvedValue(null);

      const response = await getPublicTeam(
        new NextRequest("http://localhost:3000/api/teams/not-found/public"),
        { params: Promise.resolve({ slug: "not-found" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("not_found");
    });
  });
});
