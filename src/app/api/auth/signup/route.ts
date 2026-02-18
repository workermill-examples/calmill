import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signupSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with Zod
    const validated = signupSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.email },
      select: { id: true },
    });

    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validated.username },
      select: { id: true },
    });

    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hash(validated.password, 12);

    // Create user with default schedule and availability
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        username: validated.username,
        passwordHash,
        emailVerified: null, // Will be set after email verification
        schedules: {
          create: {
            name: 'Business Hours',
            timezone: 'America/New_York',
            isDefault: true,
            availability: {
              create: [
                // Monday - Friday: 9 AM - 5 PM
                { day: 1, startTime: '09:00', endTime: '17:00' },
                { day: 2, startTime: '09:00', endTime: '17:00' },
                { day: 3, startTime: '09:00', endTime: '17:00' },
                { day: 4, startTime: '09:00', endTime: '17:00' },
                { day: 5, startTime: '09:00', endTime: '17:00' },
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
        createdAt: true,
      },
    });

    // Get the created schedule to link event types
    const schedule = await prisma.schedule.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
      },
      select: {
        id: true,
      },
    });

    // Create default event types
    if (schedule) {
      await prisma.eventType.createMany({
        data: [
          {
            title: '30 Minute Meeting',
            slug: '30min',
            duration: 30,
            userId: user.id,
            scheduleId: schedule.id,
          },
          {
            title: '60 Minute Consultation',
            slug: '60min',
            duration: 60,
            userId: user.id,
            scheduleId: schedule.id,
          },
        ],
      });
    }

    return NextResponse.json(
      {
        user,
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
