// User profile endpoint
// GET /api/user - Get current user profile

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user profile data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        timezone: true,
        weekStart: true,
        bio: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
        // Include calendar connections
        calendarConnections: {
          select: {
            id: true,
            provider: true,
            email: true,
            isPrimary: true,
            createdAt: true,
          },
        },
        // Include basic stats
        _count: {
          select: {
            eventTypes: {
              where: { isActive: true },
            },
            bookings: true,
            schedules: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "not_found", message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        image: user.image,
        timezone: user.timezone,
        weekStart: user.weekStart,
        bio: user.bio,
        theme: user.theme,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        calendarConnections: user.calendarConnections,
        stats: {
          eventTypes: user._count.eventTypes,
          totalBookings: user._count.bookings,
          schedules: user._count.schedules,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

// User update schema
const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  timezone: z.string().optional(),
  weekStart: z.number().min(0).max(6).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // If updating username, check if it's already taken
    if (updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          NOT: { id: session.user.id },
        },
        select: { id: true },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "username_taken", message: "Username is already taken" },
          { status: 400 },
        );
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        timezone: true,
        weekStart: true,
        bio: true,
        theme: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to update profile" },
      { status: 500 },
    );
  }
}

// Account deletion schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required for account deletion"),
  confirmation: z.literal("DELETE", { message: "You must type DELETE to confirm" }),
});

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { password, confirmation } = deleteAccountSchema.parse(body);

    // Get current user with password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "User not found or has no password set",
        },
        { status: 404 },
      );
    }

    // Verify password
    const bcryptjs = await import("bcryptjs");
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "invalid_password", message: "Password is incorrect" },
        { status: 400 },
      );
    }

    // Delete user account and all related data (cascade deletes will handle relationships)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid request data",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "internal", message: "Failed to delete account" },
      { status: 500 },
    );
  }
}
