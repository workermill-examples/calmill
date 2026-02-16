import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validatedFields = signupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: "Invalid input data",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, username, password } = validatedFields.data;

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          error: "email_taken",
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        {
          error: "username_taken",
          message: "This username is already taken",
        },
        { status: 409 }
      );
    }

    // Hash password with bcryptjs (12 rounds for security)
    const passwordHash = await bcryptjs.hash(password, 12);

    // Create user in database transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          username,
          passwordHash,
          timezone: "America/New_York", // Default timezone
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          timezone: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
        },
      });

      // Create default schedule for new user
      const defaultSchedule = await tx.schedule.create({
        data: {
          name: "Business Hours",
          isDefault: true,
          timezone: user.timezone,
          userId: user.id,
          availability: {
            create: [
              { day: 1, startTime: "09:00", endTime: "17:00" }, // Monday
              { day: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
              { day: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
              { day: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
              { day: 5, startTime: "09:00", endTime: "17:00" }, // Friday
            ],
          },
        },
      });

      return user;
    });

    console.log("✅ Created new user:", newUser.email);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Signup failed:", error);

    // Handle Prisma unique constraint errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        const target = (error as any).meta?.target;
        if (Array.isArray(target) && target.includes("email")) {
          return NextResponse.json(
            {
              error: "email_taken",
              message: "An account with this email already exists",
            },
            { status: 409 }
          );
        }
        if (Array.isArray(target) && target.includes("username")) {
          return NextResponse.json(
            {
              error: "username_taken",
              message: "This username is already taken",
            },
            { status: 409 }
          );
        }
      }
    }

    return NextResponse.json(
      {
        error: "internal_error",
        message: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}