import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

// Create Prisma client with Neon adapter (Prisma 7 pattern)
function createPrismaClient() {
  const connectionString =
    process.env.DIRECT_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "postgresql://localhost:5432/calmill";
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Demo user credentials
  const demoEmail = "demo@workermill.com";
  const demoPassword = "demo1234";
  const demoUsername = "demo";

  // Hash password with bcryptjs (12 rounds)
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  // Upsert demo user (idempotent)
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      passwordHash,
      username: demoUsername,
      name: "Alex Demo",
      timezone: "America/New_York",
      weekStart: 0, // Sunday
      theme: "light",
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Created/found demo user: ${demoUser.email} (${demoUser.id})`);

  // ─── SCHEDULES ──────────────────────────────────────────────────────────────

  // Schedule 1: Business Hours (default) — Mon-Fri 09:00-17:00, America/New_York
  let defaultSchedule = await prisma.schedule.findFirst({
    where: { userId: demoUser.id, name: "Business Hours" },
  });

  if (!defaultSchedule) {
    defaultSchedule = await prisma.schedule.create({
      data: {
        name: "Business Hours",
        isDefault: true,
        timezone: "America/New_York",
        userId: demoUser.id,
      },
    });
    console.log(`✅ Created default schedule: ${defaultSchedule.id}`);
  } else {
    console.log(`✅ Found existing default schedule: ${defaultSchedule.id}`);
  }

  // Create availability for Business Hours (Monday-Friday 09:00-17:00)
  const existingBizAvailability = await prisma.availability.findMany({
    where: { scheduleId: defaultSchedule.id },
  });

  if (existingBizAvailability.length === 0) {
    for (const day of [1, 2, 3, 4, 5]) {
      await prisma.availability.create({
        data: {
          day,
          startTime: "09:00",
          endTime: "17:00",
          scheduleId: defaultSchedule.id,
        },
      });
    }
    console.log(`✅ Created availability (Mon-Fri 09:00-17:00)`);
  } else {
    console.log(`✅ Found existing availability (${existingBizAvailability.length} entries)`);
  }

  // Schedule 2: Extended Hours — Mon-Fri 08:00-20:00, Sat 10:00-14:00
  let extendedSchedule = await prisma.schedule.findFirst({
    where: { userId: demoUser.id, name: "Extended Hours" },
  });

  if (!extendedSchedule) {
    extendedSchedule = await prisma.schedule.create({
      data: {
        name: "Extended Hours",
        isDefault: false,
        timezone: "America/New_York",
        userId: demoUser.id,
      },
    });

    // Mon-Fri 08:00-20:00
    for (const day of [1, 2, 3, 4, 5]) {
      await prisma.availability.create({
        data: {
          day,
          startTime: "08:00",
          endTime: "20:00",
          scheduleId: extendedSchedule.id,
        },
      });
    }
    // Sat 10:00-14:00
    await prisma.availability.create({
      data: {
        day: 6,
        startTime: "10:00",
        endTime: "14:00",
        scheduleId: extendedSchedule.id,
      },
    });
    console.log(`✅ Created Extended Hours schedule: ${extendedSchedule.id}`);
  } else {
    console.log(`✅ Found existing Extended Hours schedule: ${extendedSchedule.id}`);
  }

  // ─── EVENT TYPES ────────────────────────────────────────────────────────────

  // 1. Quick Chat — 15min, no confirmation, free
  const eventTypeQuick = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "quick-chat" } },
    update: {},
    create: {
      title: "Quick Chat",
      slug: "quick-chat",
      description: "A quick 15 minute chat to connect.",
      duration: 15,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 60,
      futureLimit: 60,
      locations: [{ type: "link", value: "Google Meet link will be provided" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeQuick.title}`);

  // 2. 30 Minute Meeting — 30min, no confirmation, free
  const eventType30 = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "30min" } },
    update: {},
    create: {
      title: "30 Minute Meeting",
      slug: "30min",
      description: "A quick 30 minute meeting to discuss your needs.",
      duration: 30,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 120,
      futureLimit: 60,
      locations: [{ type: "link", value: "Google Meet link will be provided" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventType30.title}`);

  // 3. 60 Minute Consultation — 60min, requires confirmation, free
  const eventType60 = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "60min" } },
    update: {},
    create: {
      title: "60 Minute Consultation",
      slug: "60min",
      description: "A comprehensive 60 minute consultation session.",
      duration: 60,
      isActive: true,
      requiresConfirmation: true,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 240,
      futureLimit: 60,
      locations: [{ type: "link", value: "Zoom link will be provided" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventType60.title}`);

  // 4. Technical Interview — 45min, requires confirmation, 24h minimum notice
  const eventTypeInterview = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "technical-interview" } },
    update: {},
    create: {
      title: "Technical Interview",
      slug: "technical-interview",
      description: "A 45 minute technical interview session.",
      duration: 45,
      isActive: true,
      requiresConfirmation: true,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 1440, // 24 hours
      futureLimit: 60,
      locations: [{ type: "link", value: "Video call link will be provided" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeInterview.title}`);

  // 5. Pair Programming — 90min, link location, 2h buffer after
  const eventTypePair = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "pair-programming" } },
    update: {},
    create: {
      title: "Pair Programming",
      slug: "pair-programming",
      description: "A 90 minute pair programming session.",
      duration: 90,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 120,
      futureLimit: 60,
      afterBuffer: 120, // 2 hours buffer after
      locations: [{ type: "link", value: "Google Meet link will be provided" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypePair.title}`);

  // 6. Coffee Chat — 20min, in-person, free, inactive
  const eventTypeCoffee = await prisma.eventType.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "coffee-chat" } },
    update: {},
    create: {
      title: "Coffee Chat",
      slug: "coffee-chat",
      description: "A casual 20 minute coffee chat.",
      duration: 20,
      isActive: false, // inactive
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 60,
      futureLimit: 30,
      locations: [{ type: "inPerson", value: "123 Main St" }],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeCoffee.title}`);

  // ─── DATE OVERRIDES ─────────────────────────────────────────────────────────

  const now = new Date();

  // Override 1: Block a specific date next week
  const blockedDate = new Date(now);
  blockedDate.setDate(now.getDate() + 8);
  blockedDate.setHours(0, 0, 0, 0);

  const existingBlockedOverride = await prisma.dateOverride.findFirst({
    where: { scheduleId: defaultSchedule.id, date: blockedDate },
  });

  if (!existingBlockedOverride) {
    await prisma.dateOverride.create({
      data: {
        scheduleId: defaultSchedule.id,
        date: blockedDate,
        isUnavailable: true,
      },
    });
    console.log(`✅ Created blocked date override for ${blockedDate.toISOString().slice(0, 10)}`);
  }

  // Override 2: Modified hours two weeks from now (shorter day)
  const modifiedDate = new Date(now);
  modifiedDate.setDate(now.getDate() + 15);
  modifiedDate.setHours(0, 0, 0, 0);

  const existingModifiedOverride = await prisma.dateOverride.findFirst({
    where: { scheduleId: defaultSchedule.id, date: modifiedDate },
  });

  if (!existingModifiedOverride) {
    await prisma.dateOverride.create({
      data: {
        scheduleId: defaultSchedule.id,
        date: modifiedDate,
        startTime: "10:00",
        endTime: "14:00",
        isUnavailable: false,
      },
    });
    console.log(`✅ Created modified hours override for ${modifiedDate.toISOString().slice(0, 10)}`);
  }

  // ─── BOOKINGS ───────────────────────────────────────────────────────────────

  // Helper to create a booking time relative to now (in days offset)
  function bookingTime(daysOffset: number, hour: number, minute = 0): Date {
    const d = new Date(now);
    d.setDate(now.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  const bookingsData = [
    // 8 ACCEPTED bookings — future
    {
      uid: "booking-accepted-001",
      eventTypeId: eventType30.id,
      startTime: bookingTime(2, 10, 0),
      endTime: bookingTime(2, 10, 30),
      status: "ACCEPTED" as const,
      attendeeName: "Sarah Johnson",
      attendeeEmail: "sarah@example.com",
      attendeeTimezone: "America/Los_Angeles",
    },
    {
      uid: "booking-accepted-002",
      eventTypeId: eventType30.id,
      startTime: bookingTime(3, 14, 0),
      endTime: bookingTime(3, 14, 30),
      status: "ACCEPTED" as const,
      attendeeName: "Michael Chen",
      attendeeEmail: "michael@example.com",
      attendeeTimezone: "America/Chicago",
    },
    {
      uid: "booking-accepted-003",
      eventTypeId: eventType60.id,
      startTime: bookingTime(5, 11, 0),
      endTime: bookingTime(5, 12, 0),
      status: "ACCEPTED" as const,
      attendeeName: "Emma Wilson",
      attendeeEmail: "emma@example.com",
      attendeeTimezone: "Europe/London",
    },
    {
      uid: "booking-accepted-004",
      eventTypeId: eventTypeInterview.id,
      startTime: bookingTime(7, 9, 0),
      endTime: bookingTime(7, 9, 45),
      status: "ACCEPTED" as const,
      attendeeName: "James Rodriguez",
      attendeeEmail: "james@example.com",
      attendeeTimezone: "America/New_York",
    },
    {
      uid: "booking-accepted-005",
      eventTypeId: eventTypeQuick.id,
      startTime: bookingTime(10, 15, 0),
      endTime: bookingTime(10, 15, 15),
      status: "ACCEPTED" as const,
      attendeeName: "Priya Patel",
      attendeeEmail: "priya@example.com",
      attendeeTimezone: "Asia/Kolkata",
    },
    {
      uid: "booking-accepted-006",
      eventTypeId: eventType30.id,
      startTime: bookingTime(12, 13, 0),
      endTime: bookingTime(12, 13, 30),
      status: "ACCEPTED" as const,
      attendeeName: "Lucas Müller",
      attendeeEmail: "lucas@example.com",
      attendeeTimezone: "Europe/Berlin",
    },
    {
      uid: "booking-accepted-007",
      eventTypeId: eventTypePair.id,
      startTime: bookingTime(14, 10, 0),
      endTime: bookingTime(14, 11, 30),
      status: "ACCEPTED" as const,
      attendeeName: "Yuki Tanaka",
      attendeeEmail: "yuki@example.com",
      attendeeTimezone: "Asia/Tokyo",
    },
    {
      uid: "booking-accepted-008",
      eventTypeId: eventType60.id,
      startTime: bookingTime(20, 9, 0),
      endTime: bookingTime(20, 10, 0),
      status: "ACCEPTED" as const,
      attendeeName: "Aisha Hassan",
      attendeeEmail: "aisha@example.com",
      attendeeTimezone: "Africa/Cairo",
    },
    // 3 PENDING bookings — future
    {
      uid: "booking-pending-001",
      eventTypeId: eventType60.id,
      startTime: bookingTime(6, 14, 0),
      endTime: bookingTime(6, 15, 0),
      status: "PENDING" as const,
      attendeeName: "Robert Kim",
      attendeeEmail: "robert@example.com",
      attendeeTimezone: "America/Los_Angeles",
    },
    {
      uid: "booking-pending-002",
      eventTypeId: eventTypeInterview.id,
      startTime: bookingTime(9, 11, 0),
      endTime: bookingTime(9, 11, 45),
      status: "PENDING" as const,
      attendeeName: "Clara Dupont",
      attendeeEmail: "clara@example.com",
      attendeeTimezone: "Europe/Paris",
    },
    {
      uid: "booking-pending-003",
      eventTypeId: eventType30.id,
      startTime: bookingTime(11, 16, 0),
      endTime: bookingTime(11, 16, 30),
      status: "PENDING" as const,
      attendeeName: "David Okonkwo",
      attendeeEmail: "david@example.com",
      attendeeTimezone: "Africa/Lagos",
    },
    // 2 CANCELLED bookings — future
    {
      uid: "booking-cancelled-001",
      eventTypeId: eventType30.id,
      startTime: bookingTime(4, 10, 0),
      endTime: bookingTime(4, 10, 30),
      status: "CANCELLED" as const,
      attendeeName: "Sophie Martin",
      attendeeEmail: "sophie@example.com",
      attendeeTimezone: "Europe/Paris",
      cancellationReason: "Schedule conflict",
    },
    {
      uid: "booking-cancelled-002",
      eventTypeId: eventType60.id,
      startTime: bookingTime(8, 13, 0),
      endTime: bookingTime(8, 14, 0),
      status: "CANCELLED" as const,
      attendeeName: "Tom Williams",
      attendeeEmail: "tom@example.com",
      attendeeTimezone: "America/Chicago",
      cancellationReason: "No longer needed",
    },
    // 2 past/completed bookings (negative offset)
    {
      uid: "booking-past-001",
      eventTypeId: eventType30.id,
      startTime: bookingTime(-5, 10, 0),
      endTime: bookingTime(-5, 10, 30),
      status: "ACCEPTED" as const,
      attendeeName: "Nina Kowalski",
      attendeeEmail: "nina@example.com",
      attendeeTimezone: "Europe/Warsaw",
    },
    {
      uid: "booking-past-002",
      eventTypeId: eventType60.id,
      startTime: bookingTime(-10, 14, 0),
      endTime: bookingTime(-10, 15, 0),
      status: "ACCEPTED" as const,
      attendeeName: "Carlos Mendez",
      attendeeEmail: "carlos@example.com",
      attendeeTimezone: "America/Mexico_City",
    },
  ];

  for (const booking of bookingsData) {
    const existing = await prisma.booking.findUnique({
      where: { uid: booking.uid },
    });

    if (!existing) {
      await prisma.booking.create({
        data: {
          uid: booking.uid,
          eventTypeId: booking.eventTypeId,
          userId: demoUser.id,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          attendeeName: booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          attendeeTimezone: booking.attendeeTimezone,
          cancellationReason: "cancellationReason" in booking ? booking.cancellationReason : undefined,
          // Use undefined (omit) for null JSON fields — Prisma 7 requires Prisma.DbNull for explicit null
          responses: undefined,
        },
      });
    }
  }

  console.log(`✅ Created/found ${bookingsData.length} bookings`);

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Demo credentials:");
  console.log(`   Email: ${demoEmail}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Username: ${demoUsername}`);
  console.log(`   Public Profile: /demo`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
