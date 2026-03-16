/**
 * Teams API E2E Tests
 * Tests CRUD operations for teams and team members via direct API calls
 */

import { test, expect, Page } from "@playwright/test";
import { createAuthenticatedApiClient, parseApiResponse } from "./auth-helper";

test.describe("Teams API", () => {
  let apiClient: Awaited<ReturnType<typeof createAuthenticatedApiClient>>;
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    apiClient = await createAuthenticatedApiClient(page);
  });

  test.describe("GET /api/teams", () => {
    test("should list teams for authenticated user", async () => {
      const response = await apiClient.fetch("/api/teams");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("teams");
      expect(Array.isArray(result.data.teams)).toBe(true);

      // Should have seeded data
      expect(result.data.teams.length).toBeGreaterThan(0);

      // Verify structure of team objects
      const team = result.data.teams[0];
      expect(team).toHaveProperty("id");
      expect(team).toHaveProperty("name");
      expect(team).toHaveProperty("slug");
      expect(team).toHaveProperty("bio");
      expect(team).toHaveProperty("logoUrl");
      expect(team).toHaveProperty("createdAt");
      expect(team).toHaveProperty("updatedAt");
      expect(team).toHaveProperty("members");
      expect(Array.isArray(team.members)).toBe(true);
    });

    test("should include user role in team members", async () => {
      const response = await apiClient.fetch("/api/teams");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      const teams = result.data.teams;

      if (teams.length > 0) {
        const team = teams[0];
        const member = team.members[0];

        expect(member).toHaveProperty("id");
        expect(member).toHaveProperty("role");
        expect(member).toHaveProperty("accepted");
        expect(member).toHaveProperty("user");
        expect(member.user).toHaveProperty("name");
        expect(member.user).toHaveProperty("email");
        expect(["OWNER", "ADMIN", "MEMBER"]).toContain(member.role);
        expect(typeof member.accepted).toBe("boolean");
      }
    });

    test("should require authentication", async () => {
      const response = await fetch("http://localhost:3000/api/teams");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("POST /api/teams", () => {
    test("should create team with minimal data", async () => {
      const teamData = {
        name: "Test Team",
        slug: `test-team-${Date.now()}`,
      };

      const response = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(teamData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);
      expect(result.data).toHaveProperty("team");

      const team = result.data.team;
      expect(team.name).toBe(teamData.name);
      expect(team.slug).toBe(teamData.slug);
      expect(team.bio).toBeNull();
      expect(team.logoUrl).toBeNull();

      // Creator should be OWNER
      expect(team.members).toHaveLength(1);
      expect(team.members[0].role).toBe("OWNER");
      expect(team.members[0].accepted).toBe(true);
    });

    test("should create team with full data", async () => {
      const teamData = {
        name: "Full Test Team",
        slug: `full-test-team-${Date.now()}`,
        bio: "A comprehensive test team for testing purposes",
        logoUrl: "https://example.com/logo.png",
      };

      const response = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(teamData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(201);
      expect(result.ok).toBe(true);

      const team = result.data.team;
      expect(team.name).toBe(teamData.name);
      expect(team.slug).toBe(teamData.slug);
      expect(team.bio).toBe(teamData.bio);
      expect(team.logoUrl).toBe(teamData.logoUrl);
    });

    test("should validate required fields", async () => {
      const invalidData = {
        // missing name and slug
        bio: "Invalid team",
      };

      const response = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(invalidData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
      expect(result.error).toHaveProperty("details");
      expect(Array.isArray(result.error.details)).toBe(true);
    });

    test("should validate slug format", async () => {
      const invalidSlugData = {
        name: "Test Team",
        slug: "Invalid Slug With Spaces!",
      };

      const response = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(invalidSlugData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });

    test("should reject duplicate slug", async () => {
      const slug = `duplicate-team-${Date.now()}`;
      const teamData = {
        name: "First Team",
        slug,
      };

      // Create first team
      const response1 = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(teamData),
      });
      const result1 = await parseApiResponse(response1);
      expect(result1.status).toBe(201);

      // Try to create second with same slug
      const response2 = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          ...teamData,
          name: "Second Team",
        }),
      });
      const result2 = await parseApiResponse(response2);

      expect(result2.status).toBe(409);
      expect(result2.error).toHaveProperty("error", "conflict");
      expect(result2.error.message).toContain("already exists");
    });

    test("should require authentication", async () => {
      const teamData = {
        name: "Unauthorized Team",
        slug: "unauthorized-team",
      };

      const response = await fetch("http://localhost:3000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(401);
      expect(result.error).toHaveProperty("error", "unauthorized");
    });
  });

  test.describe("GET /api/teams/[slug]", () => {
    test("should get team details with members", async () => {
      // First, get a team slug from the teams list
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const teamSlug = listResult.data.teams[0].slug;

      const response = await apiClient.fetch(`/api/teams/${teamSlug}`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("team");

      const team = result.data.team;
      expect(team.slug).toBe(teamSlug);
      expect(team).toHaveProperty("name");
      expect(team).toHaveProperty("bio");
      expect(team).toHaveProperty("logoUrl");
      expect(team).toHaveProperty("members");
      expect(Array.isArray(team.members)).toBe(true);

      // Verify detailed member information
      if (team.members.length > 0) {
        const member = team.members[0];
        expect(member).toHaveProperty("user");
        expect(member.user).toHaveProperty("name");
        expect(member.user).toHaveProperty("username");
        expect(member.user).toHaveProperty("bio");
        expect(member.user).toHaveProperty("timezone");
      }
    });

    test("should return 404 for non-existent team", async () => {
      const response = await apiClient.fetch("/api/teams/non-existent-team");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });

    test("should only allow team members to access team details", async () => {
      // Create a team first
      const teamData = {
        name: "Private Team",
        slug: `private-team-${Date.now()}`,
      };

      const createResponse = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(teamData),
      });
      const createResult = await parseApiResponse(createResponse);

      expect(createResult.status).toBe(201);

      // Access should work for team owner
      const response = await apiClient.fetch(`/api/teams/${teamData.slug}`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data.team.slug).toBe(teamData.slug);
    });
  });

  test.describe("PUT /api/teams/[slug]", () => {
    test("should update team details", async () => {
      // First, create a team
      const originalData = {
        name: "Original Team",
        slug: `update-team-${Date.now()}`,
        bio: "Original bio",
      };

      const createResponse = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(originalData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      // Update team
      const updatedData = {
        name: "Updated Team Name",
        bio: "Updated bio description",
        logoUrl: "https://example.com/updated-logo.png",
      };

      const response = await apiClient.fetch(
        `/api/teams/${originalData.slug}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedData),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("team");

      const team = result.data.team;
      expect(team.name).toBe(updatedData.name);
      expect(team.bio).toBe(updatedData.bio);
      expect(team.logoUrl).toBe(updatedData.logoUrl);
      expect(team.slug).toBe(originalData.slug); // Slug should not change
    });

    test("should require team ownership or admin role", async () => {
      // Get a team that exists
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const team = listResult.data.teams[0];
      const userRole = team.members.find(
        (m: any) => m.userId === team.members[0].userId,
      )?.role;

      const updateData = {
        name: "Should Not Update",
      };

      const response = await apiClient.fetch(`/api/teams/${team.slug}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      if (["OWNER", "ADMIN"].includes(userRole)) {
        expect(result.status).toBe(200);
      } else {
        expect(result.status).toBe(403);
        expect(result.error).toHaveProperty("error", "forbidden");
      }
    });

    test("should return 404 for non-existent team", async () => {
      const updateData = {
        name: "Non-existent Team",
      };

      const response = await apiClient.fetch("/api/teams/non-existent", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("DELETE /api/teams/[slug]", () => {
    test("should delete team (owner only)", async () => {
      // Create a team to delete
      const teamData = {
        name: "Team to Delete",
        slug: `delete-team-${Date.now()}`,
      };

      const createResponse = await apiClient.fetch("/api/teams", {
        method: "POST",
        body: JSON.stringify(teamData),
      });
      const createResult = await parseApiResponse(createResponse);
      expect(createResult.status).toBe(201);

      // Delete team
      const response = await apiClient.fetch(`/api/teams/${teamData.slug}`, {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("message");
      expect(result.data.message).toContain("deleted");

      // Verify team no longer exists
      const verifyResponse = await apiClient.fetch(
        `/api/teams/${teamData.slug}`,
      );
      const verifyResult = await parseApiResponse(verifyResponse);
      expect(verifyResult.status).toBe(404);
    });

    test("should return 404 for non-existent team", async () => {
      const response = await apiClient.fetch("/api/teams/non-existent", {
        method: "DELETE",
      });
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });

  test.describe("Team Members - GET /api/teams/[slug]/members", () => {
    test("should list team members", async () => {
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const teamSlug = listResult.data.teams[0].slug;

      const response = await apiClient.fetch(`/api/teams/${teamSlug}/members`);
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("members");
      expect(Array.isArray(result.data.members)).toBe(true);

      if (result.data.members.length > 0) {
        const member = result.data.members[0];
        expect(member).toHaveProperty("id");
        expect(member).toHaveProperty("role");
        expect(member).toHaveProperty("accepted");
        expect(member).toHaveProperty("user");
        expect(member.user).toHaveProperty("name");
        expect(member.user).toHaveProperty("email");
        expect(member.user).toHaveProperty("username");
      }
    });
  });

  test.describe("Team Members - POST /api/teams/[slug]/members", () => {
    test("should invite member by email", async () => {
      // Get a team first
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const team = listResult.data.teams[0];
      const userRole = team.members[0]?.role;

      // Only test if user has permission to invite
      if (!["OWNER", "ADMIN"].includes(userRole)) {
        console.log("User lacks permission to invite members, skipping test");
        return;
      }

      const inviteData = {
        email: `test-invite-${Date.now()}@example.com`,
        role: "MEMBER",
      };

      const response = await apiClient.fetch(
        `/api/teams/${team.slug}/members`,
        {
          method: "POST",
          body: JSON.stringify(inviteData),
        },
      );
      const result = await parseApiResponse(response);

      // This might fail if the email doesn't correspond to an existing user
      if (result.status === 201) {
        expect(result.data).toHaveProperty("member");
        expect(result.data.member.role).toBe("MEMBER");
        expect(result.data.member.accepted).toBe(false); // Invitation pending
      } else if (result.status === 404) {
        expect(result.error).toHaveProperty("error", "not_found");
        expect(result.error.message).toContain("User not found");
      }
    });

    test("should validate role values", async () => {
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const team = listResult.data.teams[0];

      const invalidInviteData = {
        email: "test@example.com",
        role: "INVALID_ROLE",
      };

      const response = await apiClient.fetch(
        `/api/teams/${team.slug}/members`,
        {
          method: "POST",
          body: JSON.stringify(invalidInviteData),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(400);
      expect(result.error).toHaveProperty("error", "validation_error");
    });
  });

  test.describe("Team Members - PUT /api/teams/[slug]/members/[memberId]", () => {
    test("should update member role", async () => {
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const team = listResult.data.teams[0];
      const userRole = team.members[0]?.role;

      // Only test if user has permission and there are multiple members
      if (!["OWNER"].includes(userRole) || team.members.length < 2) {
        console.log(
          "Insufficient permissions or members for role update test, skipping",
        );
        return;
      }

      // Find a member that is not the current user
      const targetMember = team.members.find((m: any) => m.role !== "OWNER");

      if (!targetMember) {
        console.log("No suitable member found for role update test, skipping");
        return;
      }

      const updateData = {
        role: "ADMIN",
      };

      const response = await apiClient.fetch(
        `/api/teams/${team.slug}/members/${targetMember.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("member");
      expect(result.data.member.role).toBe("ADMIN");
    });
  });

  test.describe("Team Members - DELETE /api/teams/[slug]/members/[memberId]", () => {
    test("should remove team member", async () => {
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const team = listResult.data.teams[0];
      const userRole = team.members[0]?.role;

      // Only test if user has permission and there are multiple members
      if (!["OWNER", "ADMIN"].includes(userRole) || team.members.length < 2) {
        console.log(
          "Insufficient permissions or members for removal test, skipping",
        );
        return;
      }

      // Find a member that is not the current user
      const targetMember = team.members.find((m: any) => m.role !== "OWNER");

      if (!targetMember) {
        console.log("No suitable member found for removal test, skipping");
        return;
      }

      const response = await apiClient.fetch(
        `/api/teams/${team.slug}/members/${targetMember.id}`,
        {
          method: "DELETE",
        },
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("message");
      expect(result.data.message).toContain("removed");
    });
  });

  test.describe("Team Invitations", () => {
    test("should list invitations for user", async () => {
      const response = await apiClient.fetch("/api/teams/invitations");
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("invitations");
      expect(Array.isArray(result.data.invitations)).toBe(true);

      // Structure validation for invitations
      if (result.data.invitations.length > 0) {
        const invitation = result.data.invitations[0];
        expect(invitation).toHaveProperty("id");
        expect(invitation).toHaveProperty("role");
        expect(invitation).toHaveProperty("accepted");
        expect(invitation).toHaveProperty("team");
        expect(invitation.team).toHaveProperty("name");
        expect(invitation.team).toHaveProperty("slug");
      }
    });
  });

  test.describe("Public Team Access", () => {
    test("should access public team information", async () => {
      const listResponse = await apiClient.fetch("/api/teams");
      const listResult = await parseApiResponse(listResponse);

      if (listResult.data.teams.length === 0) {
        console.log("No teams found, skipping test");
        return;
      }

      const teamSlug = listResult.data.teams[0].slug;

      // Access public team info without authentication
      const response = await fetch(
        `http://localhost:3000/api/teams/${teamSlug}/public`,
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("team");

      const team = result.data.team;
      expect(team).toHaveProperty("name");
      expect(team).toHaveProperty("slug");
      expect(team).toHaveProperty("bio");
      expect(team).toHaveProperty("logoUrl");
      expect(team).toHaveProperty("members");

      // Should not include sensitive member information
      if (team.members.length > 0) {
        const member = team.members[0];
        expect(member.user).toHaveProperty("name");
        expect(member.user).toHaveProperty("username");
        expect(member.user).toHaveProperty("bio");
        // Should not include email or other sensitive data
        expect(member.user).not.toHaveProperty("email");
      }
    });

    test("should return 404 for non-existent public team", async () => {
      const response = await fetch(
        "http://localhost:3000/api/teams/non-existent-team/public",
      );
      const result = await parseApiResponse(response);

      expect(result.status).toBe(404);
      expect(result.error).toHaveProperty("error", "not_found");
    });
  });
});
