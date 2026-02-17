import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

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

  // ─── SCHEDULE 1: Business Hours (default) ──────────────────────────
  let defaultSchedule = await prisma.schedule.findFirst({
    where: {
      userId: demoUser.id,
      name: "Business Hours",
    },
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
    console.log(`✅ Created schedule: ${defaultSchedule.name} (${defaultSchedule.id})`);
  } else {
    console.log(`✅ Found existing schedule: ${defaultSchedule.name} (${defaultSchedule.id})`);
  }

  // Create availability for Business Hours (Monday-Friday 09:00-17:00)
  const existingAvailability = await prisma.availability.findMany({
    where: { scheduleId: defaultSchedule.id },
  });

  if (existingAvailability.length === 0) {
    const weekdayAvailability = [
      { day: 1, startTime: "09:00", endTime: "17:00" }, // Monday
      { day: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
      { day: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
      { day: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
      { day: 5, startTime: "09:00", endTime: "17:00" }, // Friday
    ];

    for (const availability of weekdayAvailability) {
      await prisma.availability.create({
        data: {
          ...availability,
          scheduleId: defaultSchedule.id,
        },
      });
    }
    console.log(`✅ Created availability for Business Hours (Mon-Fri 09:00-17:00)`);
  } else {
    console.log(`✅ Found existing availability (${existingAvailability.length} entries)`);
  }

  // ─── SCHEDULE 2: Extended Hours ────────────────────────────────────
  let extendedSchedule = await prisma.schedule.findFirst({
    where: {
      userId: demoUser.id,
      name: "Extended Hours",
    },
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
    console.log(`✅ Created schedule: ${extendedSchedule.name} (${extendedSchedule.id})`);
  } else {
    console.log(`✅ Found existing schedule: ${extendedSchedule.name} (${extendedSchedule.id})`);
  }

  // Create availability for Extended Hours (Mon-Fri 08:00-20:00, Sat 10:00-14:00)
  const existingExtendedAvailability = await prisma.availability.findMany({
    where: { scheduleId: extendedSchedule.id },
  });

  if (existingExtendedAvailability.length === 0) {
    const extendedAvailability = [
      { day: 1, startTime: "08:00", endTime: "20:00" }, // Monday
      { day: 2, startTime: "08:00", endTime: "20:00" }, // Tuesday
      { day: 3, startTime: "08:00", endTime: "20:00" }, // Wednesday
      { day: 4, startTime: "08:00", endTime: "20:00" }, // Thursday
      { day: 5, startTime: "08:00", endTime: "20:00" }, // Friday
      { day: 6, startTime: "10:00", endTime: "14:00" }, // Saturday
    ];

    for (const availability of extendedAvailability) {
      await prisma.availability.create({
        data: {
          ...availability,
          scheduleId: extendedSchedule.id,
        },
      });
    }
    console.log(`✅ Created availability for Extended Hours (Mon-Fri 08:00-20:00, Sat 10:00-14:00)`);
  } else {
    console.log(`✅ Found existing extended availability (${existingExtendedAvailability.length} entries)`);
  }

  // ─── DATE OVERRIDES ────────────────────────────────────────────────
  // Helper to get a future date
  const now = new Date();
  const futureDate1 = new Date(now);
  futureDate1.setDate(now.getDate() + 10); // 10 days from now — blocked all day
  futureDate1.setHours(0, 0, 0, 0);

  const futureDate2 = new Date(now);
  futureDate2.setDate(now.getDate() + 20); // 20 days from now — modified hours
  futureDate2.setHours(0, 0, 0, 0);

  // Date override 1: Blocked day on Business Hours schedule
  const existingOverride1 = await prisma.dateOverride.findFirst({
    where: {
      scheduleId: defaultSchedule.id,
      isUnavailable: true,
    },
  });

  if (!existingOverride1) {
    await prisma.dateOverride.create({
      data: {
        date: futureDate1,
        isUnavailable: true,
        scheduleId: defaultSchedule.id,
      },
    });
    console.log(`✅ Created date override: blocked day (${futureDate1.toISOString().split("T")[0]})`);
  } else {
    console.log(`✅ Found existing blocked day override`);
  }

  // Date override 2: Modified hours on Business Hours schedule
  const existingOverride2 = await prisma.dateOverride.findFirst({
    where: {
      scheduleId: defaultSchedule.id,
      isUnavailable: false,
    },
  });

  if (!existingOverride2) {
    await prisma.dateOverride.create({
      data: {
        date: futureDate2,
        startTime: "10:00",
        endTime: "14:00",
        isUnavailable: false,
        scheduleId: defaultSchedule.id,
      },
    });
    console.log(`✅ Created date override: modified hours (${futureDate2.toISOString().split("T")[0]}, 10:00-14:00)`);
  } else {
    console.log(`✅ Found existing modified hours override`);
  }

  // ─── EVENT TYPES ────────────────────────────────────────────────────

  // 1. Quick Chat (15min, no confirmation, free)
  const eventTypeQuickChat = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "quick-chat",
      },
    },
    update: {},
    create: {
      title: "Quick Chat",
      slug: "quick-chat",
      description: "A quick 15 minute chat to connect and discuss anything on your mind.",
      duration: 15,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      minimumNotice: 30, // 30 minutes
      futureLimit: 30,
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      locations: [
        {
          type: "link",
          value: "Google Meet link will be provided",
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeQuickChat.title} (${eventTypeQuickChat.id})`);

  // 2. 30 Minute Meeting (existing, recurring-enabled for demo)
  const eventType30 = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "30min",
      },
    },
    update: {
      recurringEnabled: true,
      recurringFrequency: "weekly",
      recurringMaxOccurrences: 4,
    },
    create: {
      title: "30 Minute Meeting",
      slug: "30min",
      description: "A quick 30 minute meeting to discuss your needs.",
      duration: 30,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      minimumNotice: 120, // 2 hours
      futureLimit: 60, // 60 days
      recurringEnabled: true,
      recurringFrequency: "weekly",
      recurringMaxOccurrences: 4,
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      locations: [
        {
          type: "link",
          value: "Google Meet link will be provided",
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventType30.title} (${eventType30.id})`);

  // 3. 60 Minute Consultation (existing, requires confirmation)
  const eventType60 = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "60min",
      },
    },
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
      minimumNotice: 240, // 4 hours
      futureLimit: 60, // 60 days
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      locations: [
        {
          type: "link",
          value: "Zoom link will be provided",
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventType60.title} (${eventType60.id})`);

  // 4. Technical Interview (45min, requires confirmation, 24h minimum notice)
  const eventTypeTechInterview = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "technical-interview",
      },
    },
    update: {},
    create: {
      title: "Technical Interview",
      slug: "technical-interview",
      description:
        "A structured 45 minute technical interview. Please be prepared to discuss your experience and solve coding challenges.",
      duration: 45,
      isActive: true,
      requiresConfirmation: true,
      price: 0,
      currency: "USD",
      minimumNotice: 1440, // 24 hours
      futureLimit: 30,
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      locations: [
        {
          type: "link",
          value: "Zoom link will be provided",
        },
      ],
      customQuestions: [
        {
          id: "years-experience",
          label: "Years of professional experience",
          type: "select",
          required: true,
          options: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
        },
        {
          id: "primary-language",
          label: "Primary programming language",
          type: "text",
          required: true,
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeTechInterview.title} (${eventTypeTechInterview.id})`);

  // 5. Pair Programming (90min, link location, 2h buffer after)
  const eventTypePairProgramming = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "pair-programming",
      },
    },
    update: {},
    create: {
      title: "Pair Programming",
      slug: "pair-programming",
      description:
        "A 90 minute collaborative coding session. We will work together on your code using screen sharing.",
      duration: 90,
      isActive: true,
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      minimumNotice: 120, // 2 hours
      afterBuffer: 120, // 2 hours buffer after
      futureLimit: 30,
      userId: demoUser.id,
      scheduleId: extendedSchedule.id,
      locations: [
        {
          type: "link",
          value: "https://meet.google.com/stub-pair-programming",
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypePairProgramming.title} (${eventTypePairProgramming.id})`);

  // 6. Coffee Chat (20min, in-person, inactive)
  const eventTypeCoffeeChat = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "coffee-chat",
      },
    },
    update: {},
    create: {
      title: "Coffee Chat",
      slug: "coffee-chat",
      description: "A casual 20 minute coffee chat. Let us meet in person and get to know each other!",
      duration: 20,
      isActive: false, // inactive
      requiresConfirmation: false,
      price: 0,
      currency: "USD",
      minimumNotice: 60, // 1 hour
      futureLimit: 14,
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      locations: [
        {
          type: "inPerson",
          value: "123 Main St",
        },
      ],
    },
  });
  console.log(`✅ Created/found event type: ${eventTypeCoffeeChat.title} (${eventTypeCoffeeChat.id})`);

  // ─── BOOKINGS ────────────────────────────────────────────────────────
  // Generate 15 bookings spread across the next 30 days with mixed statuses
  // 8 ACCEPTED, 3 PENDING, 2 CANCELLED, 2 past/completed

  const bookingData = [
    // Past bookings (completed - ~2 weeks ago and ~1 week ago)
    {
      daysOffset: -14,
      hour: 10,
      eventType: eventType30,
      attendeeName: "Sarah Johnson",
      attendeeEmail: "sarah.johnson@example.com",
      attendeeTimezone: "America/Chicago",
      status: "ACCEPTED" as const,
      title: "30 Minute Meeting with Sarah Johnson",
      description: "Discussing project requirements and timeline.",
    },
    {
      daysOffset: -7,
      hour: 14,
      eventType: eventType60,
      attendeeName: "Michael Chen",
      attendeeEmail: "michael.chen@example.com",
      attendeeTimezone: "America/Los_Angeles",
      status: "ACCEPTED" as const,
      title: "60 Minute Consultation with Michael Chen",
      description: "Full consultation session about system architecture.",
    },
    // Upcoming ACCEPTED bookings
    {
      daysOffset: 1,
      hour: 9,
      eventType: eventTypeQuickChat,
      attendeeName: "Emma Williams",
      attendeeEmail: "emma.williams@example.com",
      attendeeTimezone: "Europe/London",
      status: "ACCEPTED" as const,
      title: "Quick Chat with Emma Williams",
      description: "Quick sync about onboarding questions.",
    },
    {
      daysOffset: 2,
      hour: 11,
      eventType: eventType30,
      attendeeName: "James Rodriguez",
      attendeeEmail: "james.rodriguez@example.com",
      attendeeTimezone: "America/Chicago",
      status: "ACCEPTED" as const,
      title: "30 Minute Meeting with James Rodriguez",
      description: "Follow-up on last week's proposal.",
    },
    {
      daysOffset: 3,
      hour: 13,
      eventType: eventTypeTechInterview,
      attendeeName: "Aisha Patel",
      attendeeEmail: "aisha.patel@example.com",
      attendeeTimezone: "America/New_York",
      status: "ACCEPTED" as const,
      title: "Technical Interview with Aisha Patel",
      description: "Senior backend engineer candidate interview.",
      responses: {
        "years-experience": "3-5 years",
        "primary-language": "TypeScript",
      },
    },
    {
      daysOffset: 5,
      hour: 10,
      eventType: eventType60,
      attendeeName: "David Kim",
      attendeeEmail: "david.kim@example.com",
      attendeeTimezone: "America/Los_Angeles",
      status: "ACCEPTED" as const,
      title: "60 Minute Consultation with David Kim",
      description: "API design consultation for mobile app backend.",
    },
    {
      daysOffset: 8,
      hour: 15,
      eventType: eventTypePairProgramming,
      attendeeName: "Olivia Smith",
      attendeeEmail: "olivia.smith@example.com",
      attendeeTimezone: "America/New_York",
      status: "ACCEPTED" as const,
      title: "Pair Programming with Olivia Smith",
      description: "Working on React component refactoring.",
    },
    {
      daysOffset: 12,
      hour: 9,
      eventType: eventType30,
      attendeeName: "Lucas Brown",
      attendeeEmail: "lucas.brown@example.com",
      attendeeTimezone: "Europe/Berlin",
      status: "ACCEPTED" as const,
      title: "30 Minute Meeting with Lucas Brown",
      description: "Discussing partnership opportunities.",
    },
    // Upcoming PENDING bookings
    {
      daysOffset: 4,
      hour: 14,
      eventType: eventType60,
      attendeeName: "Sophia Martinez",
      attendeeEmail: "sophia.martinez@example.com",
      attendeeTimezone: "America/Mexico_City",
      status: "PENDING" as const,
      title: "60 Minute Consultation with Sophia Martinez",
      description: "Product strategy consultation. Awaiting confirmation.",
    },
    {
      daysOffset: 7,
      hour: 11,
      eventType: eventTypeTechInterview,
      attendeeName: "Ethan Davis",
      attendeeEmail: "ethan.davis@example.com",
      attendeeTimezone: "America/Chicago",
      status: "PENDING" as const,
      title: "Technical Interview with Ethan Davis",
      description: "Full-stack developer candidate. Interview pending confirmation.",
      responses: {
        "years-experience": "1-3 years",
        "primary-language": "JavaScript",
      },
    },
    {
      daysOffset: 15,
      hour: 10,
      eventType: eventTypeTechInterview,
      attendeeName: "Isabella Wilson",
      attendeeEmail: "isabella.wilson@example.com",
      attendeeTimezone: "America/Denver",
      status: "PENDING" as const,
      title: "Technical Interview with Isabella Wilson",
      description: "Frontend engineer candidate. Interview pending confirmation.",
      responses: {
        "years-experience": "3-5 years",
        "primary-language": "React",
      },
    },
    // CANCELLED bookings
    {
      daysOffset: 6,
      hour: 13,
      eventType: eventType30,
      attendeeName: "Noah Anderson",
      attendeeEmail: "noah.anderson@example.com",
      attendeeTimezone: "America/New_York",
      status: "CANCELLED" as const,
      title: "30 Minute Meeting with Noah Anderson",
      description: "Meeting cancelled by attendee.",
      cancellationReason: "Attendee had a scheduling conflict.",
    },
    {
      daysOffset: 9,
      hour: 10,
      eventType: eventTypeQuickChat,
      attendeeName: "Mia Thompson",
      attendeeEmail: "mia.thompson@example.com",
      attendeeTimezone: "America/Los_Angeles",
      status: "CANCELLED" as const,
      title: "Quick Chat with Mia Thompson",
      description: "Quick chat cancelled.",
      cancellationReason: "No longer needed.",
    },
    // Additional ACCEPTED future bookings to reach 15 total
    {
      daysOffset: 18,
      hour: 14,
      eventType: eventType30,
      attendeeName: "Liam Garcia",
      attendeeEmail: "liam.garcia@example.com",
      attendeeTimezone: "America/Phoenix",
      status: "ACCEPTED" as const,
      title: "30 Minute Meeting with Liam Garcia",
      description: "Quarterly business review meeting.",
    },
    {
      daysOffset: 25,
      hour: 11,
      eventType: eventTypePairProgramming,
      attendeeName: "Charlotte Lee",
      attendeeEmail: "charlotte.lee@example.com",
      attendeeTimezone: "America/New_York",
      status: "ACCEPTED" as const,
      title: "Pair Programming with Charlotte Lee",
      description: "Database optimization session.",
    },
  ];

  let bookingCount = 0;
  for (const booking of bookingData) {
    const startTime = new Date(now);
    startTime.setDate(now.getDate() + booking.daysOffset);
    startTime.setHours(booking.hour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + booking.eventType.duration);

    // Check if booking already exists for this attendee + event type + time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventTypeId: booking.eventType.id,
        attendeeEmail: booking.attendeeEmail,
        startTime: startTime,
      },
    });

    if (!existingBooking) {
      const cancelledAt =
        booking.status === "CANCELLED" ? new Date() : null;

      await prisma.booking.create({
        data: {
          title: booking.title,
          description: booking.description,
          startTime,
          endTime,
          status: booking.status,
          attendeeName: booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          attendeeTimezone: booking.attendeeTimezone,
          responses: booking.responses ?? Prisma.DbNull,
          cancellationReason: booking.cancellationReason ?? null,
          cancelledAt,
          userId: demoUser.id,
          eventTypeId: booking.eventType.id,
        },
      });
      bookingCount++;
    }
  }

  console.log(`✅ Created ${bookingCount} bookings (15 total planned: 8 ACCEPTED, 3 PENDING, 2 CANCELLED, 2 past)`);

  // ─── ADDITIONAL USERS: Alice & Bob ─────────────────────────────────

  const alicePassword = await bcrypt.hash("alice1234", 12);
  const bobPassword = await bcrypt.hash("bob1234", 12);

  const aliceUser = await prisma.user.upsert({
    where: { email: "alice@workermill.com" },
    update: {},
    create: {
      email: "alice@workermill.com",
      passwordHash: alicePassword,
      username: "alice",
      name: "Alice Cooper",
      timezone: "America/Chicago",
      weekStart: 1, // Monday
      theme: "light",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created/found user: ${aliceUser.email} (${aliceUser.id})`);

  const bobUser = await prisma.user.upsert({
    where: { email: "bob@workermill.com" },
    update: {},
    create: {
      email: "bob@workermill.com",
      passwordHash: bobPassword,
      username: "bob",
      name: "Bob Builder",
      timezone: "America/Los_Angeles",
      weekStart: 1, // Monday
      theme: "light",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Created/found user: ${bobUser.email} (${bobUser.id})`);

  // Alice's schedule: Mon-Fri 09:00-17:00 Central
  let aliceSchedule = await prisma.schedule.findFirst({
    where: { userId: aliceUser.id, name: "Business Hours" },
  });
  if (!aliceSchedule) {
    aliceSchedule = await prisma.schedule.create({
      data: {
        name: "Business Hours",
        isDefault: true,
        timezone: "America/Chicago",
        userId: aliceUser.id,
      },
    });
    const weekdays = [1, 2, 3, 4, 5]; // Mon-Fri
    for (const day of weekdays) {
      await prisma.availability.create({
        data: { day, startTime: "09:00", endTime: "17:00", scheduleId: aliceSchedule.id },
      });
    }
    console.log(`✅ Created schedule for Alice: Business Hours`);
  } else {
    console.log(`✅ Found existing schedule for Alice`);
  }

  // Bob's schedule: Mon-Fri 09:00-17:00 Pacific
  let bobSchedule = await prisma.schedule.findFirst({
    where: { userId: bobUser.id, name: "Business Hours" },
  });
  if (!bobSchedule) {
    bobSchedule = await prisma.schedule.create({
      data: {
        name: "Business Hours",
        isDefault: true,
        timezone: "America/Los_Angeles",
        userId: bobUser.id,
      },
    });
    const weekdays = [1, 2, 3, 4, 5]; // Mon-Fri
    for (const day of weekdays) {
      await prisma.availability.create({
        data: { day, startTime: "09:00", endTime: "17:00", scheduleId: bobSchedule.id },
      });
    }
    console.log(`✅ Created schedule for Bob: Business Hours`);
  } else {
    console.log(`✅ Found existing schedule for Bob`);
  }

  // ─── TEAM: CalMill Demo Team ────────────────────────────────────────

  let demoTeam = await prisma.team.findFirst({
    where: { slug: "calmill-demo-team" },
  });

  if (!demoTeam) {
    demoTeam = await prisma.team.create({
      data: {
        name: "CalMill Demo Team",
        slug: "calmill-demo-team",
        bio: "The CalMill showcase team demonstrating round-robin and collective scheduling.",
        logoUrl: null,
      },
    });
    console.log(`✅ Created team: ${demoTeam.name} (${demoTeam.id})`);
  } else {
    console.log(`✅ Found existing team: ${demoTeam.name} (${demoTeam.id})`);
  }

  // Team members: demo user as OWNER, Alice and Bob as MEMBER (accepted)
  const teamMembersData = [
    { userId: demoUser.id, role: "OWNER" as const },
    { userId: aliceUser.id, role: "MEMBER" as const },
    { userId: bobUser.id, role: "MEMBER" as const },
  ];

  for (const memberData of teamMembersData) {
    const existingMember = await prisma.teamMember.findFirst({
      where: { teamId: demoTeam.id, userId: memberData.userId },
    });
    if (!existingMember) {
      await prisma.teamMember.create({
        data: {
          teamId: demoTeam.id,
          userId: memberData.userId,
          role: memberData.role,
          accepted: true,
        },
      });
    }
  }
  console.log(`✅ Created/found team members (OWNER: demo, MEMBER: alice, bob)`);

  // ─── TEAM EVENT TYPES ───────────────────────────────────────────────

  // 1. Team Standup — 15min, ROUND_ROBIN, no confirmation
  let teamStandup = await prisma.eventType.findFirst({
    where: { teamId: demoTeam.id, slug: "team-standup" },
  });
  if (!teamStandup) {
    teamStandup = await prisma.eventType.create({
      data: {
        title: "Team Standup",
        slug: "team-standup",
        description: "A quick 15 minute team standup. Distributed round-robin across team members.",
        duration: 15,
        isActive: true,
        requiresConfirmation: false,
        price: 0,
        currency: "USD",
        minimumNotice: 30,
        futureLimit: 30,
        schedulingType: "ROUND_ROBIN",
        userId: demoUser.id,
        teamId: demoTeam.id,
        scheduleId: defaultSchedule.id,
        locations: [{ type: "link", value: "Google Meet link will be provided" }],
      },
    });
    console.log(`✅ Created team event type: ${teamStandup.title} (${teamStandup.id})`);
  } else {
    console.log(`✅ Found existing team event type: ${teamStandup.title}`);
  }

  // 2. Group Demo — 30min, COLLECTIVE, requires confirmation
  let groupDemo = await prisma.eventType.findFirst({
    where: { teamId: demoTeam.id, slug: "group-demo" },
  });
  if (!groupDemo) {
    groupDemo = await prisma.eventType.create({
      data: {
        title: "Group Demo",
        slug: "group-demo",
        description: "A 30 minute group demo with the full team. All members must be available.",
        duration: 30,
        isActive: true,
        requiresConfirmation: true,
        price: 0,
        currency: "USD",
        minimumNotice: 120,
        futureLimit: 60,
        schedulingType: "COLLECTIVE",
        userId: demoUser.id,
        teamId: demoTeam.id,
        scheduleId: defaultSchedule.id,
        locations: [{ type: "link", value: "Zoom link will be provided" }],
      },
    });
    console.log(`✅ Created team event type: ${groupDemo.title} (${groupDemo.id})`);
  } else {
    console.log(`✅ Found existing team event type: ${groupDemo.title}`);
  }

  // ─── TEAM BOOKINGS ──────────────────────────────────────────────────
  // 5 bookings: 3 round-robin (assigned to different members), 2 collective

  const teamBookingsData = [
    // Round-robin booking #1 — assigned to demo user (Alex)
    {
      daysOffset: 2,
      hour: 10,
      eventType: teamStandup,
      assignedUserId: demoUser.id,
      attendeeName: "Rachel Green",
      attendeeEmail: "rachel.green@example.com",
      attendeeTimezone: "America/New_York",
      status: "ACCEPTED" as const,
      title: "Team Standup with Rachel Green",
      description: "Round-robin standup — assigned to Alex Demo.",
    },
    // Round-robin booking #2 — assigned to Alice
    {
      daysOffset: 3,
      hour: 11,
      eventType: teamStandup,
      assignedUserId: aliceUser.id,
      attendeeName: "Ross Geller",
      attendeeEmail: "ross.geller@example.com",
      attendeeTimezone: "America/Chicago",
      status: "ACCEPTED" as const,
      title: "Team Standup with Ross Geller",
      description: "Round-robin standup — assigned to Alice Cooper.",
    },
    // Round-robin booking #3 — assigned to Bob
    {
      daysOffset: 4,
      hour: 9,
      eventType: teamStandup,
      assignedUserId: bobUser.id,
      attendeeName: "Monica Geller",
      attendeeEmail: "monica.geller@example.com",
      attendeeTimezone: "America/Los_Angeles",
      status: "ACCEPTED" as const,
      title: "Team Standup with Monica Geller",
      description: "Round-robin standup — assigned to Bob Builder.",
    },
    // Collective booking #1 — assigned to demo user (creator/administrative owner)
    {
      daysOffset: 6,
      hour: 14,
      eventType: groupDemo,
      assignedUserId: demoUser.id,
      attendeeName: "Joey Tribbiani",
      attendeeEmail: "joey.tribbiani@example.com",
      attendeeTimezone: "America/New_York",
      status: "PENDING" as const,
      title: "Group Demo with Joey Tribbiani",
      description: "Collective demo — all team members attending.",
    },
    // Collective booking #2 — assigned to demo user (creator/administrative owner)
    {
      daysOffset: 10,
      hour: 15,
      eventType: groupDemo,
      assignedUserId: demoUser.id,
      attendeeName: "Chandler Bing",
      attendeeEmail: "chandler.bing@example.com",
      attendeeTimezone: "America/Chicago",
      status: "ACCEPTED" as const,
      title: "Group Demo with Chandler Bing",
      description: "Collective demo — all team members attending.",
    },
  ];

  let teamBookingCount = 0;
  for (const booking of teamBookingsData) {
    const startTime = new Date(now);
    startTime.setDate(now.getDate() + booking.daysOffset);
    startTime.setHours(booking.hour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + booking.eventType.duration);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventTypeId: booking.eventType.id,
        attendeeEmail: booking.attendeeEmail,
        startTime,
      },
    });

    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          title: booking.title,
          description: booking.description,
          startTime,
          endTime,
          status: booking.status,
          attendeeName: booking.attendeeName,
          attendeeEmail: booking.attendeeEmail,
          attendeeTimezone: booking.attendeeTimezone,
          responses: Prisma.DbNull,
          userId: booking.assignedUserId,
          eventTypeId: booking.eventType.id,
        },
      });
      teamBookingCount++;
    }
  }
  console.log(`✅ Created ${teamBookingCount} team bookings (3 round-robin, 2 collective)`);

  // ─── WEBHOOKS ────────────────────────────────────────────────────────

  // Webhook 1: Active — points to httpbin.org for demo purposes
  const existingWebhook1 = await prisma.webhook.findFirst({
    where: {
      userId: demoUser.id,
      url: "https://httpbin.org/post",
    },
  });

  if (!existingWebhook1) {
    await prisma.webhook.create({
      data: {
        url: "https://httpbin.org/post",
        eventTriggers: [
          "BOOKING_CREATED",
          "BOOKING_CANCELLED",
          "BOOKING_RESCHEDULED",
          "BOOKING_ACCEPTED",
          "BOOKING_REJECTED",
        ],
        active: true,
        secret: crypto.randomBytes(32).toString("hex"),
        userId: demoUser.id,
      },
    });
    console.log(`✅ Created webhook: httpbin.org/post (active, all events)`);
  } else {
    console.log(`✅ Found existing active webhook`);
  }

  // Webhook 2: Inactive — example Slack endpoint (demo, not real)
  const existingWebhook2 = await prisma.webhook.findFirst({
    where: {
      userId: demoUser.id,
      url: "https://hooks.slack.com/services/demo/calmill/notifications",
    },
  });

  if (!existingWebhook2) {
    await prisma.webhook.create({
      data: {
        url: "https://hooks.slack.com/services/demo/calmill/notifications",
        eventTriggers: ["BOOKING_CREATED", "BOOKING_CANCELLED"],
        active: false,
        secret: crypto.randomBytes(32).toString("hex"),
        userId: demoUser.id,
      },
    });
    console.log(`✅ Created webhook: Slack notifications (inactive)`);
  } else {
    console.log(`✅ Found existing inactive webhook`);
  }

  // ─── RECURRING BOOKINGS ──────────────────────────────────────────────
  // 3 recurring booking series (weekly, 4 occurrences each) using the 30min event type

  const recurringSeriesData = [
    {
      recurringEventId: "recurring-series-alpha-weekly-2026",
      attendeeName: "Priya Sharma",
      attendeeEmail: "priya.sharma@example.com",
      attendeeTimezone: "Asia/Kolkata",
      baseOffsetDays: 3, // starts 3 days from now
      baseHour: 10,
      title: "30 Minute Meeting with Priya Sharma",
      description: "Weekly sync — design review series.",
      status: "ACCEPTED" as const,
    },
    {
      recurringEventId: "recurring-series-beta-weekly-2026",
      attendeeName: "Carlos Mendez",
      attendeeEmail: "carlos.mendez@example.com",
      attendeeTimezone: "America/Bogota",
      baseOffsetDays: 4, // starts 4 days from now
      baseHour: 14,
      title: "30 Minute Meeting with Carlos Mendez",
      description: "Weekly check-in — product roadmap alignment.",
      status: "ACCEPTED" as const,
    },
    {
      recurringEventId: "recurring-series-gamma-weekly-2026",
      attendeeName: "Yuki Tanaka",
      attendeeEmail: "yuki.tanaka@example.com",
      attendeeTimezone: "Asia/Tokyo",
      baseOffsetDays: 5, // starts 5 days from now
      baseHour: 9,
      title: "30 Minute Meeting with Yuki Tanaka",
      description: "Weekly standup — engineering collaboration.",
      status: "PENDING" as const,
    },
  ];

  let recurringBookingCount = 0;
  for (const series of recurringSeriesData) {
    for (let occurrence = 0; occurrence < 4; occurrence++) {
      const startTime = new Date(now);
      startTime.setDate(now.getDate() + series.baseOffsetDays + occurrence * 7);
      startTime.setHours(series.baseHour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + eventType30.duration);

      const existingRecurring = await prisma.booking.findFirst({
        where: {
          recurringEventId: series.recurringEventId,
          attendeeEmail: series.attendeeEmail,
          startTime,
        },
      });

      if (!existingRecurring) {
        await prisma.booking.create({
          data: {
            title: series.title,
            description: series.description,
            startTime,
            endTime,
            status: series.status,
            attendeeName: series.attendeeName,
            attendeeEmail: series.attendeeEmail,
            attendeeTimezone: series.attendeeTimezone,
            responses: Prisma.DbNull,
            recurringEventId: series.recurringEventId,
            userId: demoUser.id,
            eventTypeId: eventType30.id,
          },
        });
        recurringBookingCount++;
      }
    }
  }
  console.log(`✅ Created ${recurringBookingCount} recurring bookings (3 series × 4 occurrences)`);

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Demo credentials:");
  console.log(`   Email: ${demoEmail}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Username: ${demoUsername}`);
  console.log("\n📅 Seed summary:");
  console.log(`   Schedules: Business Hours (default), Extended Hours`);
  console.log(`   Event Types: Quick Chat, 30min Meeting (recurring-enabled), 60min Consultation, Technical Interview, Pair Programming, Coffee Chat (inactive)`);
  console.log(`   Bookings: 15 total (8 ACCEPTED, 3 PENDING, 2 CANCELLED, 2 past)`);
  console.log(`   Recurring Bookings: 3 series × 4 occurrences = 12 bookings (2 ACCEPTED series, 1 PENDING series)`);
  console.log(`   Date Overrides: 1 blocked day, 1 modified hours`);
  console.log(`   Webhooks: 2 total (1 active → httpbin.org/post, 1 inactive → Slack demo)`);
  console.log(`   Team: CalMill Demo Team (slug: calmill-demo-team)`);
  console.log(`   Team Members: Alex Demo (OWNER), Alice Cooper (MEMBER), Bob Builder (MEMBER)`);
  console.log(`   Team Event Types: Team Standup (ROUND_ROBIN), Group Demo (COLLECTIVE)`);
  console.log(`   Team Bookings: 5 total (3 round-robin ACCEPTED, 1 collective PENDING, 1 collective ACCEPTED)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
