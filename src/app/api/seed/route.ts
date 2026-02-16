import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Check for Bearer token authorization
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.SEED_TOKEN;

    if (!expectedToken) {
      console.error("SEED_TOKEN environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid seed token" },
        { status: 403 }
      );
    }

    console.log("🌱 Starting seed via API...");

    // Create demo user with predictable credentials (idempotent)
    const passwordHash = await bcryptjs.hash("demo1234", 12);

    const demoUser = await prisma.user.upsert({
      where: { email: "demo@workermill.com" },
      update: {
        // Update fields to ensure consistency
        username: "demo",
        name: "Alex Demo",
        passwordHash,
        timezone: "America/New_York",
        bio: "Demo user for CalMill - Book time with me to see how the platform works!",
      },
      create: {
        email: "demo@workermill.com",
        username: "demo",
        name: "Alex Demo",
        passwordHash,
        timezone: "America/New_York",
        bio: "Demo user for CalMill - Book time with me to see how the platform works!",
      },
    });

    console.log("✅ Created/updated demo user:", demoUser.email);

    // Create default schedule (idempotent)
    const defaultSchedule = await prisma.schedule.upsert({
      where: {
        userId_name: {
          userId: demoUser.id,
          name: "Business Hours",
        },
      },
      update: {
        // Update fields to ensure consistency
        isDefault: true,
        timezone: "America/New_York",
      },
      create: {
        name: "Business Hours",
        isDefault: true,
        timezone: "America/New_York",
        userId: demoUser.id,
      },
    });

    console.log("✅ Created/updated default schedule:", defaultSchedule.name);

    // Create availability for Monday-Friday 9-5 (idempotent)
    const workdays = [1, 2, 3, 4, 5]; // Monday through Friday

    for (const day of workdays) {
      await prisma.availability.upsert({
        where: {
          scheduleId_day: {
            scheduleId: defaultSchedule.id,
            day,
          },
        },
        update: {
          // Update fields to ensure consistency
          startTime: "09:00",
          endTime: "17:00",
        },
        create: {
          day,
          startTime: "09:00",
          endTime: "17:00",
          scheduleId: defaultSchedule.id,
        },
      });
    }

    console.log("✅ Created/updated availability for Monday-Friday 9AM-5PM");

    // Create two stub event types (idempotent)
    const eventType1 = await prisma.eventType.upsert({
      where: {
        userId_slug: {
          userId: demoUser.id,
          slug: "30min",
        },
      },
      update: {
        // Update fields to ensure consistency
        title: "30 Minute Meeting",
        description: "A quick 30-minute meeting to discuss your project or questions.",
        duration: 30,
        locations: [{ type: "link", value: "Google Meet" }],
        scheduleId: defaultSchedule.id,
        color: "#3b82f6",
      },
      create: {
        title: "30 Minute Meeting",
        slug: "30min",
        description: "A quick 30-minute meeting to discuss your project or questions.",
        duration: 30,
        locations: [{ type: "link", value: "Google Meet" }],
        userId: demoUser.id,
        scheduleId: defaultSchedule.id,
        color: "#3b82f6",
      },
    });

    const eventType2 = await prisma.eventType.upsert({
      where: {
        userId_slug: {
          userId: demoUser.id,
          slug: "60min",
        },
      },
      update: {
        // Update fields to ensure consistency
        title: "60 Minute Consultation",
        description: "A comprehensive 60-minute consultation session for detailed project planning.",
        duration: 60,
        locations: [{ type: "link", value: "Google Meet" }],
        scheduleId: defaultSchedule.id,
        color: "#059669",
      },
      create: {
        title: "60 Minute Consultation",
        slug: "60min",
        description: "A comprehensive 60-minute consultation session for detailed project planning.",
        duration: 60,
        locations: [{ type: "link", value: "Google Meet" }],
        userId: demoUser.id,
        scheduleId: defaultSchedule.id,
        color: "#059669",
      },
    });

    console.log("✅ Created/updated event types:", eventType1.title, "and", eventType2.title);

    console.log("🎉 Seed completed successfully via API!");

    return NextResponse.json(
      {
        success: true,
        message: "Seed data created successfully",
        data: {
          user: {
            id: demoUser.id,
            email: demoUser.email,
            username: demoUser.username,
            name: demoUser.name,
          },
          schedule: {
            id: defaultSchedule.id,
            name: defaultSchedule.name,
          },
          eventTypes: [
            {
              id: eventType1.id,
              title: eventType1.title,
              slug: eventType1.slug,
            },
            {
              id: eventType2.id,
              title: eventType2.title,
              slug: eventType2.slug,
            },
          ],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Seed failed via API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Seed operation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}