import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import { ZodError } from "zod";

/**
 * Signup Endpoint
 * Creates new user with validation, uniqueness checks, and default schedule
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validatedData = signupSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          error: "email_taken",
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
      select: { id: true },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          error: "username_taken",
          message: "This username is already taken",
        },
        { status: 409 }
      );
    }

    // Hash password with bcryptjs (12 rounds)
    const passwordHash = await hash(validatedData.password, 12);

    // Create user with default schedule and availability
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        username: validatedData.username,
        passwordHash,
        timezone: "America/New_York", // Default timezone
        weekStart: 0, // Sunday
        theme: "light",
        schedules: {
          create: {
            name: "Business Hours",
            isDefault: true,
            timezone: "America/New_York",
            availability: {
              create: [
                // Monday - Friday: 9 AM - 5 PM
                { day: 1, startTime: "09:00", endTime: "17:00" },
                { day: 2, startTime: "09:00", endTime: "17:00" },
                { day: 3, startTime: "09:00", endTime: "17:00" },
                { day: 4, startTime: "09:00", endTime: "17:00" },
                { day: 5, startTime: "09:00", endTime: "17:00" },
              ],
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        timezone: true,
        weekStart: true,
        theme: true,
        createdAt: true,
      },
    });

    console.log(`✅ New user created: ${user.email} (${user.id})`);

    // Return user object (no password)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid input data",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint errors (backup check)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      if (error.message.includes("email")) {
        return NextResponse.json(
          {
            error: "email_taken",
            message: "An account with this email already exists",
          },
          { status: 409 }
        );
      }
      if (error.message.includes("username")) {
        return NextResponse.json(
          {
            error: "username_taken",
            message: "This username is already taken",
          },
          { status: 409 }
        );
      }
    }

    // Generic error
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
