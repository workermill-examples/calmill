import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrismaClient, mockSession } from "../helpers/setup";

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrismaClient,
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: vi.fn((data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
      _data: data,
      _status: init?.status ?? 200,
    })) as unknown as any,
  },
}));

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

import { GET as _listTeams, POST as _createTeam } from "@/app/api/teams/route";
import {
  GET as _getTeam,
  PUT as _updateTeam,
  DELETE as _deleteTeam,
} from "@/app/api/teams/[slug]/route";
import { GET as _listMembers, POST as _inviteMember } from "@/app/api/teams/[slug]/members/route";
import {
  PUT as _updateMemberRole,
  DELETE as _removeMember,
} from "@/app/api/teams/[slug]/members/[memberId]/route";
import { GET as _listInvitations } from "@/app/api/teams/invitations/route";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listTeams = _listTeams as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTeam = _createTeam as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTeam = _getTeam as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateTeam = _updateTeam as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteTeam = _deleteTeam as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listMembers = _listMembers as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const inviteMember = _inviteMember as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateMemberRole = _updateMemberRole as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeMember = _removeMember as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listInvitations = _listInvitations as (...args: any[]) => Promise<any>;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function makeRequest(body?: unknown, method = "GET"): Request {
  return {
    method,
    json: async () => body,
    url: "http://localhost:3000/api/teams",
    headers: new Headers(),
  } as unknown as Request;
}

function makeSlugContext(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function makeSlugMemberContext(slug: string, memberId: string) {
  return { params: Promise.resolve({ slug, memberId }) };
}

const mockOwnerMember = {
  id: "member-1",
  userId: "demo-user-id", // matches mockSession.user.id
  teamId: "team-1",
  role: "OWNER" as const,
  accepted: true,
  createdAt: new Date("2026-01-01"),
};

const mockAdminMember = {
  id: "member-admin",
  userId: "demo-user-id",
  teamId: "team-1",
  role: "ADMIN" as const,
  accepted: true,
  createdAt: new Date("2026-01-01"),
};

const mockTeam = {
  id: "team-1",
  name: "Test Team",
  slug: "test-team",
  logoUrl: null,
  bio: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  _count: { members: 1 },
};

// ─── GET /api/teams — List Teams ──────────────────────────────────────────────

describe("GET /api/teams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns teams the authenticated user belongs to", async () => {
    mockPrismaClient.teamMember.findMany.mockResolvedValue([
      {
        ...mockOwnerMember,
        team: { ...mockTeam, _count: { members: 3 } },
      },
    ]);

    const response = await listTeams(makeRequest(), makeSlugContext(""));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].name).toBe("Test Team");
    expect(data.data[0].userRole).toBe("OWNER");
  });

  it("returns empty array when user belongs to no teams", async () => {
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    const response = await listTeams(makeRequest(), makeSlugContext(""));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });
});

// ─── POST /api/teams — Create Team ───────────────────────────────────────────

describe("POST /api/teams", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a team and sets the creator as OWNER", async () => {
    mockPrismaClient.team.findMany.mockResolvedValue([]); // no slug conflicts
    mockPrismaClient.$transaction.mockImplementation(async (callback: (tx: typeof mockPrismaClient) => Promise<typeof mockTeam>) =>
      callback(mockPrismaClient)
    );
    mockPrismaClient.team.create.mockResolvedValue(mockTeam);
    mockPrismaClient.teamMember.create.mockResolvedValue(mockOwnerMember);
    mockPrismaClient.team.findUnique.mockResolvedValue({
      ...mockTeam,
      _count: { members: 1 },
    });

    const response = await createTeam(
      makeRequest({ name: "Test Team" }, "POST"),
      makeSlugContext("")
    );
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(mockPrismaClient.teamMember.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: "OWNER", accepted: true }),
      })
    );
  });

  it("auto-generates a slug from the team name", async () => {
    mockPrismaClient.team.findMany.mockResolvedValue([]);
    mockPrismaClient.$transaction.mockImplementation(async (callback: (tx: typeof mockPrismaClient) => Promise<typeof mockTeam>) =>
      callback(mockPrismaClient)
    );
    mockPrismaClient.team.create.mockResolvedValue({ ...mockTeam, slug: "my-team" });
    mockPrismaClient.teamMember.create.mockResolvedValue(mockOwnerMember);
    mockPrismaClient.team.findUnique.mockResolvedValue({ ...mockTeam, _count: { members: 1 } });

    await createTeam(makeRequest({ name: "My Team" }, "POST"), makeSlugContext(""));

    const createCall = mockPrismaClient.team.create.mock.calls[0][0];
    // Slug should be derived from "My Team" → "my-team"
    expect(createCall.data.slug).toBe("my-team");
  });

  it("deduplicates slug when a conflict exists", async () => {
    // Simulate "test-team" already taken
    mockPrismaClient.team.findMany.mockResolvedValue([{ slug: "test-team" }]);
    mockPrismaClient.$transaction.mockImplementation(async (callback: (tx: typeof mockPrismaClient) => Promise<typeof mockTeam>) =>
      callback(mockPrismaClient)
    );
    mockPrismaClient.team.create.mockResolvedValue({ ...mockTeam, slug: "test-team-2" });
    mockPrismaClient.teamMember.create.mockResolvedValue(mockOwnerMember);
    mockPrismaClient.team.findUnique.mockResolvedValue({ ...mockTeam, _count: { members: 1 } });

    await createTeam(makeRequest({ name: "Test Team" }, "POST"), makeSlugContext(""));

    const createCall = mockPrismaClient.team.create.mock.calls[0][0];
    expect(createCall.data.slug).toBe("test-team-2");
  });

  it("returns 400 for missing team name", async () => {
    const response = await createTeam(
      makeRequest({ bio: "no name" }, "POST"),
      makeSlugContext("")
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });
});

// ─── GET /api/teams/[slug] ────────────────────────────────────────────────────

describe("GET /api/teams/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns team details for a member", async () => {
    // verifyTeamMembership → teamMember.findFirst
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockOwnerMember);
    mockPrismaClient.team.findUnique.mockResolvedValue({
      ...mockTeam,
      members: [mockOwnerMember],
      eventTypes: [],
    });

    const response = await getTeam(makeRequest(), makeSlugContext("test-team"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.slug).toBe("test-team");
  });

  it("returns 404 when the user is not a team member", async () => {
    // verifyTeamMembership returns null → 404
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(null);

    const response = await getTeam(makeRequest(), makeSlugContext("nonexistent-team"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeTruthy();
  });
});

// ─── DELETE /api/teams/[slug] — Delete Team ───────────────────────────────────

describe("DELETE /api/teams/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the team when the actor is OWNER", async () => {
    // verifyTeamRole → verifyTeamMembership → findFirst returns OWNER
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockOwnerMember);
    // The DELETE handler calls prisma.$transaction([...array of promises])
    // Mock it to resolve (array form, not callback form)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockPrismaClient.$transaction as any).mockResolvedValue([]);
    // Also add deleteMany to eventType mock for the transaction call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockPrismaClient.eventType as any).deleteMany = vi.fn().mockResolvedValue({ count: 0 });
    mockPrismaClient.booking.deleteMany.mockResolvedValue({ count: 0 });
    mockPrismaClient.teamMember.deleteMany.mockResolvedValue({ count: 0 });
    mockPrismaClient.team.delete.mockResolvedValue(mockTeam);

    const response = await deleteTeam(makeRequest(undefined, "DELETE"), makeSlugContext("test-team"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Team deleted");
  });

  it("returns 403 when a non-OWNER tries to delete", async () => {
    // Actor is ADMIN, not OWNER → role check fails
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockAdminMember);

    const response = await deleteTeam(makeRequest(undefined, "DELETE"), makeSlugContext("test-team"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden");
  });

  it("returns 404 when team does not exist / user is not a member", async () => {
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(null);

    const response = await deleteTeam(makeRequest(undefined, "DELETE"), makeSlugContext("no-such-team"));
    const data = await response.json();

    expect(response.status).toBe(404);
  });
});

// ─── POST /api/teams/[slug]/members — Invite Member ──────────────────────────

describe("POST /api/teams/[slug]/members", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invites a user by email (ADMIN+ required)", async () => {
    // verifyTeamRole → ADMIN membership exists
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockAdminMember);
    // Invited user exists
    mockPrismaClient.user.findUnique.mockResolvedValue({
      id: "user-new",
      name: "Alice",
      email: "alice@example.com",
    });
    // No existing membership
    mockPrismaClient.teamMember.findUnique.mockResolvedValue(null);
    // Create invitation
    mockPrismaClient.teamMember.create.mockResolvedValue({
      id: "member-new",
      userId: "user-new",
      teamId: "team-1",
      role: "MEMBER",
      accepted: false,
      user: { id: "user-new", name: "Alice", email: "alice@example.com", avatarUrl: null, timezone: "UTC" },
    });

    const response = await inviteMember(
      makeRequest({ email: "alice@example.com", role: "MEMBER" }, "POST"),
      makeSlugContext("test-team")
    );
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.accepted).toBe(false);
  });

  it("returns 404 when invited email does not have an account", async () => {
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockAdminMember);
    mockPrismaClient.user.findUnique.mockResolvedValue(null); // no account

    const response = await inviteMember(
      makeRequest({ email: "noone@example.com", role: "MEMBER" }, "POST"),
      makeSlugContext("test-team")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toMatch(/not found/i);
  });

  it("returns 409 when user is already a member or has a pending invitation", async () => {
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockAdminMember);
    mockPrismaClient.user.findUnique.mockResolvedValue({ id: "user-existing", name: "Bob", email: "bob@example.com" });
    // Already a member
    mockPrismaClient.teamMember.findUnique.mockResolvedValue({
      id: "existing-member",
      userId: "user-existing",
      teamId: "team-1",
      role: "MEMBER",
      accepted: true,
    });

    const response = await inviteMember(
      makeRequest({ email: "bob@example.com", role: "MEMBER" }, "POST"),
      makeSlugContext("test-team")
    );
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toMatch(/already/i);
  });

  it("prevents granting a role higher than the inviter's role", async () => {
    // Inviter is ADMIN, trying to invite as OWNER
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(mockAdminMember);
    mockPrismaClient.user.findUnique.mockResolvedValue({ id: "user-new", name: "Carol", email: "carol@example.com" });
    mockPrismaClient.teamMember.findUnique.mockResolvedValue(null);

    const response = await inviteMember(
      makeRequest({ email: "carol@example.com", role: "OWNER" }, "POST"),
      makeSlugContext("test-team")
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toMatch(/higher than your own/i);
  });
});

// ─── PUT /api/teams/[slug]/members/[memberId] — Update Role ──────────────────

describe("PUT /api/teams/[slug]/members/[memberId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a member's role (OWNER only)", async () => {
    // Actor is OWNER
    mockPrismaClient.teamMember.findFirst
      .mockResolvedValueOnce(mockOwnerMember) // verifyTeamRole
      .mockResolvedValueOnce({               // target member
        id: "member-bob",
        userId: "user-bob",
        teamId: "team-1",
        role: "MEMBER",
        accepted: true,
      });

    mockPrismaClient.teamMember.update.mockResolvedValue({
      id: "member-bob",
      userId: "user-bob",
      teamId: "team-1",
      role: "ADMIN",
      accepted: true,
      user: { id: "user-bob", name: "Bob", email: "bob@example.com", avatarUrl: null, timezone: "UTC" },
    });

    const response = await updateMemberRole(
      makeRequest({ role: "ADMIN" }, "PUT"),
      makeSlugMemberContext("test-team", "member-bob")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.role).toBe("ADMIN");
  });

  it("prevents changing own role", async () => {
    // Actor IS the target member
    mockPrismaClient.teamMember.findFirst
      .mockResolvedValueOnce(mockOwnerMember) // verifyTeamRole
      .mockResolvedValueOnce({               // target member — same userId as actor
        id: "member-1",
        userId: "demo-user-id", // same as mockSession
        teamId: "team-1",
        role: "OWNER",
        accepted: true,
      });

    const response = await updateMemberRole(
      makeRequest({ role: "ADMIN" }, "PUT"),
      makeSlugMemberContext("test-team", "member-1")
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/own role/i);
  });

  it("protects last OWNER from demotion", async () => {
    const targetOwnerId = "member-other-owner";

    mockPrismaClient.teamMember.findFirst
      .mockResolvedValueOnce(mockOwnerMember) // verifyTeamRole (actor)
      .mockResolvedValueOnce({               // target member (a different OWNER)
        id: targetOwnerId,
        userId: "user-other",
        teamId: "team-1",
        role: "OWNER",
        accepted: true,
      });

    // Only 1 accepted OWNER in the team
    mockPrismaClient.teamMember.count.mockResolvedValue(1);

    const response = await updateMemberRole(
      makeRequest({ role: "ADMIN" }, "PUT"),
      makeSlugMemberContext("test-team", targetOwnerId)
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/last owner/i);
    expect(mockPrismaClient.teamMember.update).not.toHaveBeenCalled();
  });
});

// ─── DELETE /api/teams/[slug]/members/[memberId] — Remove Member ──────────────

describe("DELETE /api/teams/[slug]/members/[memberId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a member to remove themselves (self-removal)", async () => {
    const selfMember = {
      id: "member-self",
      userId: "demo-user-id", // matches session user
      teamId: "team-1",
      role: "MEMBER" as const,
      accepted: true,
    };

    // findFirst for targetMember (by id and team slug)
    mockPrismaClient.teamMember.findFirst
      .mockResolvedValueOnce(selfMember) // target member lookup
      .mockResolvedValueOnce(selfMember); // self-removal verification

    // Not an OWNER, so no ownerCount check needed
    mockPrismaClient.teamMember.count.mockResolvedValue(2);
    mockPrismaClient.teamMember.delete.mockResolvedValue(selfMember);

    const response = await removeMember(
      makeRequest(undefined, "DELETE"),
      makeSlugMemberContext("test-team", "member-self")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Member removed");
  });

  it("prevents removal of the last OWNER", async () => {
    const ownerToRemove = {
      id: "member-other-owner",
      userId: "user-other-owner",  // different from demo-user-id
      teamId: "team-1",
      role: "OWNER" as const,
      accepted: true,
    };

    // Call order:
    // 1. findFirst for targetMember (by id + team slug) → ownerToRemove
    // 2. Not self-removal → verifyTeamRole → verifyTeamMembership → findFirst → actorMember (OWNER)
    // 3. count accepted OWNERs → 1 → block removal
    mockPrismaClient.teamMember.findFirst
      .mockResolvedValueOnce(ownerToRemove) // target member lookup
      .mockResolvedValueOnce(mockOwnerMember); // verifyTeamMembership for actor

    // Only 1 accepted OWNER
    mockPrismaClient.teamMember.count.mockResolvedValue(1);

    const response = await removeMember(
      makeRequest(undefined, "DELETE"),
      makeSlugMemberContext("test-team", "member-other-owner")
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/last owner/i);
    expect(mockPrismaClient.teamMember.delete).not.toHaveBeenCalled();
  });

  it("returns 404 when the member does not exist", async () => {
    mockPrismaClient.teamMember.findFirst.mockResolvedValue(null);

    const response = await removeMember(
      makeRequest(undefined, "DELETE"),
      makeSlugMemberContext("test-team", "nonexistent-member")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toMatch(/member not found/i);
  });
});

// ─── GET /api/teams/invitations ───────────────────────────────────────────────

describe("GET /api/teams/invitations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns pending invitations for the authenticated user", async () => {
    mockPrismaClient.teamMember.findMany.mockResolvedValue([
      {
        id: "invitation-1",
        userId: "demo-user-id",
        teamId: "team-1",
        role: "MEMBER",
        accepted: false,
        createdAt: new Date("2026-02-01"),
        team: {
          id: "team-1",
          name: "Test Team",
          slug: "test-team",
          logoUrl: null,
          bio: null,
          _count: { members: 3 },
        },
      },
    ]);

    const response = await listInvitations(makeRequest(), { params: Promise.resolve({}) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].accepted).toBe(false);
    expect(data.data[0].team.name).toBe("Test Team");
  });

  it("returns empty array when user has no pending invitations", async () => {
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    const response = await listInvitations(makeRequest(), { params: Promise.resolve({}) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual([]);
  });

  it("only queries invitations with accepted: false", async () => {
    mockPrismaClient.teamMember.findMany.mockResolvedValue([]);

    await listInvitations(makeRequest(), { params: Promise.resolve({}) });

    const callArgs = mockPrismaClient.teamMember.findMany.mock.calls[0][0];
    expect(callArgs.where).toMatchObject({ accepted: false });
  });
});
