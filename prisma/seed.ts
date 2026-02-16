import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import * as bcrypt from 'bcryptjs';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL || 'postgresql://localhost:5432/calmill';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon({ pool });
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = createPrismaClient();

  console.log('🌱 Starting seed...');

  // Create demo user with predictable credentials
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@workermill.com' },
    update: {},
    create: {
      email: 'demo@workermill.com',
      username: 'demo',
      name: 'Alex Demo',
      passwordHash,
      timezone: 'America/New_York',
      bio: 'Demo user for CalMill - Book time with me to see how the platform works!',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // Create default schedule
  const defaultSchedule = await prisma.schedule.upsert({
    where: {
      userId: demoUser.id,
    },
    update: {},
    create: {
      name: 'Business Hours',
      isDefault: true,
      timezone: 'America/New_York',
      userId: demoUser.id,
    },
  });

  console.log('✅ Created default schedule:', defaultSchedule.name);

  // Create availability for Monday-Friday 9-5
  const workdays = [1, 2, 3, 4, 5]; // Monday through Friday

  for (const day of workdays) {
    await prisma.availability.upsert({
      where: {
        scheduleId_day: {
          scheduleId: defaultSchedule.id,
          day,
        },
      },
      update: {},
      create: {
        day,
        startTime: '09:00',
        endTime: '17:00',
        scheduleId: defaultSchedule.id,
      },
    });
  }

  console.log('✅ Created availability for Monday-Friday 9AM-5PM');

  // Create two stub event types
  const eventType1 = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: '30min',
      },
    },
    update: {},
    create: {
      title: '30 Minute Meeting',
      slug: '30min',
      description: 'A quick 30-minute meeting to discuss your project or questions.',
      duration: 30,
      locations: [
        { type: 'link', value: 'Google Meet' }
      ],
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      color: '#3b82f6',
    },
  });

  const eventType2 = await prisma.eventType.upsert({
    where: {
      userId_slug: {
        userId: demoUser.id,
        slug: '60min',
      },
    },
    update: {},
    create: {
      title: '60 Minute Consultation',
      slug: '60min',
      description: 'A comprehensive 60-minute consultation session for detailed project planning.',
      duration: 60,
      locations: [
        { type: 'link', value: 'Google Meet' }
      ],
      userId: demoUser.id,
      scheduleId: defaultSchedule.id,
      color: '#059669',
    },
  });

  console.log('✅ Created event types:', eventType1.title, 'and', eventType2.title);

  console.log('🎉 Seed completed successfully!');

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });