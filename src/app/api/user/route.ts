import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { updateUserSchema } from "@/lib/validations";

// GET /api/user — Get current authenticated user's profile
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        timezone: true,
        weekStart: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
        // Include whether user has a password (credentials auth)
        passwordHash: true,
        accounts: {
          select: { provider: true },
        },
        schedules: {
          where: { isDefault: true },
          select: { id: true, name: true },
          take: 1,
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't expose passwordHash — just expose whether credentials auth is available
    const { passwordHash, ...userWithoutHash } = dbUser;

    return NextResponse.json({
      success: true,
      data: {
        ...userWithoutHash,
        hasPassword: !!passwordHash,
        defaultSchedule: dbUser.schedules[0] ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// PATCH /api/user — Update current authenticated user's profile
export const PATCH = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    // If username is being changed, check availability
    if (validated.username && validated.username !== user.username) {
      const existing = await prisma.user.findUnique({
        where: { username: validated.username },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.username !== undefined && { username: validated.username }),
        ...(validated.bio !== undefined && { bio: validated.bio }),
        ...(validated.timezone !== undefined && { timezone: validated.timezone }),
        ...(validated.weekStart !== undefined && { weekStart: validated.weekStart }),
        ...(validated.theme !== undefined && { theme: validated.theme }),
        ...(validated.avatarUrl !== undefined && { avatarUrl: validated.avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        timezone: true,
        weekStart: true,
        theme: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("PATCH /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// DELETE /api/user — Delete authenticated user's account
export const DELETE = withAuth(async (_request, _context, user) => {
  try {
    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
