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

  // Create default schedule
  let defaultSchedule = await prisma.schedule.findFirst({
    where: {
      userId: demoUser.id,
      isDefault: true,
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
    console.log(`✅ Created default schedule: ${defaultSchedule.id}`);
  } else {
    console.log(`✅ Found existing default schedule: ${defaultSchedule.id}`);
  }

  // Create availability (Monday-Friday 09:00-17:00)
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
    console.log(`✅ Created availability (Monday-Friday 09:00-17:00)`);
  } else {
    console.log(`✅ Found existing availability (${existingAvailability.length} entries)`);
  }

  // Create event types
  const eventType30 = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: "30min",
      },
    },
    update: {},
    create: {
      title: "30 Minute Meeting",
      slug: "30min",
      description: "A quick 30 minute meeting to discuss your needs.",
      duration: 30,
      isActive: true,
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 120, // 2 hours
      futureLimit: 60, // 60 days
      locations: [
        {
          type: "link",
          value: "Google Meet link will be provided",
        },
      ],
    },
  });

  console.log(`✅ Created/found event type: ${eventType30.title} (${eventType30.id})`);

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
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      minimumNotice: 240, // 4 hours
      futureLimit: 60, // 60 days
      locations: [
        {
          type: "link",
          value: "Zoom link will be provided",
        },
      ],
    },
  });

  console.log(`✅ Created/found event type: ${eventType60.title} (${eventType60.id})`);

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Demo credentials:");
  console.log(`   Email: ${demoEmail}`);
  console.log(`   Password: ${demoPassword}`);
  console.log(`   Username: ${demoUsername}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
