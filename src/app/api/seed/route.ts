import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * Seed Endpoint
 * Protected by SEED_TOKEN via Bearer header
 * Creates demo user, default schedule, availability, and event types
 * Idempotent - safe to run multiple times
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization — accept x-seed-token header or Authorization: Bearer
    const token =
      request.headers.get('x-seed-token') ??
      request.headers.get('authorization')?.replace('Bearer ', '');
    const expectedToken = process.env.SEED_TOKEN;

    if (!expectedToken) {
      return NextResponse.json({ error: 'Seed endpoint not configured' }, { status: 500 });
    }

    if (
      !token ||
      token.length !== expectedToken.length ||
      !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🌱 Starting database seed via API...');

    // Demo user credentials
    const demoEmail = 'demo@workermill.com';
    const demoPassword = 'demo1234';
    const demoUsername = 'demo';

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
        name: 'Alex Demo',
        timezone: 'America/New_York',
        weekStart: 0, // Sunday
        theme: 'light',
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
          name: 'Business Hours',
          isDefault: true,
          timezone: 'America/New_York',
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
        { day: 1, startTime: '09:00', endTime: '17:00' }, // Monday
        { day: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
        { day: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
        { day: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
        { day: 5, startTime: '09:00', endTime: '17:00' }, // Friday
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
          slug: '30min',
        },
      },
      update: {},
      create: {
        title: '30 Minute Meeting',
        slug: '30min',
        description: 'A quick 30 minute meeting to discuss your needs.',
        duration: 30,
        isActive: true,
        userId: demoUser.id,
        scheduleId: defaultSchedule.id,
        minimumNotice: 120, // 2 hours
        futureLimit: 60, // 60 days
        locations: [
          {
            type: 'link',
            value: 'Google Meet link will be provided',
          },
        ],
      },
    });

    console.log(`✅ Created/found event type: ${eventType30.title} (${eventType30.id})`);

    const eventType60 = await prisma.eventType.upsert({
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
        description: 'A comprehensive 60 minute consultation session.',
        duration: 60,
        isActive: true,
        userId: demoUser.id,
        scheduleId: defaultSchedule.id,
        minimumNotice: 240, // 4 hours
        futureLimit: 60, // 60 days
        locations: [
          {
            type: 'link',
            value: 'Zoom link will be provided',
          },
        ],
      },
    });

    console.log(`✅ Created/found event type: ${eventType60.title} (${eventType60.id})`);

    console.log('🎉 Database seeding completed via API!');

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
        data: {
          user: {
            id: demoUser.id,
            email: demoUser.email,
            username: demoUser.username,
          },
          schedule: {
            id: defaultSchedule.id,
            name: defaultSchedule.name,
          },
          eventTypes: [
            {
              id: eventType30.id,
              title: eventType30.title,
              slug: eventType30.slug,
            },
            {
              id: eventType60.id,
              title: eventType60.title,
              slug: eventType60.slug,
            },
          ],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    return NextResponse.json(
      {
        error: 'Seed failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
