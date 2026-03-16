// Seed endpoint for creating demo data
// POST /api/seed - Idempotent seed endpoint protected by SEED_TOKEN

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check SEED_TOKEN for protection
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
      return NextResponse.json(
        { error: "forbidden", message: "Invalid or missing seed token" },
        { status: 403 },
      );
    }

    console.log("Starting idempotent seed process...");

    // 1. Create demo user (idempotent)
    const hashedPassword = await bcryptjs.hash("demo1234", 12);

    const demoUser = await prisma.user.upsert({
      where: { email: "demo@workermill.com" },
      update: { passwordHash: hashedPassword },
      create: {
        email: "demo@workermill.com",
        username: "demo",
        name: "Alex Demo",
        passwordHash: hashedPassword,
        timezone: "America/New_York",
        weekStart: 0,
        bio: "Demo user for CalMill showcase - an AI-powered scheduling platform built by WorkerMill",
        theme: "light",
      },
    });

    console.log("Demo user created/found:", demoUser.id);

    // 2. Create schedules (idempotent)
    // Find or create business hours schedule
    let businessHoursSchedule = await prisma.schedule.findFirst({
      where: {
        userId: demoUser.id,
        name: "Business Hours",
      },
    });

    if (!businessHoursSchedule) {
      businessHoursSchedule = await prisma.schedule.create({
        data: {
          name: "Business Hours",
          isDefault: true,
          timezone: "America/New_York",
          userId: demoUser.id,
        },
      });
    }

    // Find or create extended hours schedule
    let extendedHoursSchedule = await prisma.schedule.findFirst({
      where: {
        userId: demoUser.id,
        name: "Extended Hours",
      },
    });

    if (!extendedHoursSchedule) {
      extendedHoursSchedule = await prisma.schedule.create({
        data: {
          name: "Extended Hours",
          isDefault: false,
          timezone: "America/New_York",
          userId: demoUser.id,
        },
      });
    }

    console.log("Schedules created/found");

    // 3. Create availability for Business Hours (Mon-Fri 09:00-17:00)
    const businessHoursAvailability = [
      { day: 1, startTime: "09:00", endTime: "17:00" }, // Monday
      { day: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
      { day: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
      { day: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
      { day: 5, startTime: "09:00", endTime: "17:00" }, // Friday
    ];

    for (const availability of businessHoursAvailability) {
      const existing = await prisma.availability.findFirst({
        where: {
          scheduleId: businessHoursSchedule.id,
          day: availability.day,
        },
      });

      if (!existing) {
        await prisma.availability.create({
          data: {
            ...availability,
            scheduleId: businessHoursSchedule.id,
          },
        });
      }
    }

    // 4. Create availability for Extended Hours (Mon-Fri 08:00-20:00 + Sat 10:00-14:00)
    const extendedHoursAvailability = [
      { day: 1, startTime: "08:00", endTime: "20:00" }, // Monday
      { day: 2, startTime: "08:00", endTime: "20:00" }, // Tuesday
      { day: 3, startTime: "08:00", endTime: "20:00" }, // Wednesday
      { day: 4, startTime: "08:00", endTime: "20:00" }, // Thursday
      { day: 5, startTime: "08:00", endTime: "20:00" }, // Friday
      { day: 6, startTime: "10:00", endTime: "14:00" }, // Saturday
    ];

    for (const availability of extendedHoursAvailability) {
      const existing = await prisma.availability.findFirst({
        where: {
          scheduleId: extendedHoursSchedule.id,
          day: availability.day,
        },
      });

      if (!existing) {
        await prisma.availability.create({
          data: {
            ...availability,
            scheduleId: extendedHoursSchedule.id,
          },
        });
      }
    }

    console.log("Availability created/found");

    // 5. Create event types (idempotent)
    const eventTypesData = [
      {
        title: "Quick Chat",
        slug: "quick-chat",
        description:
          "A brief 15-minute conversation to discuss your needs and see how I can help.",
        duration: 15,
        isActive: true,
        requiresConfirmation: false,
        minimumNotice: 60,
        beforeBuffer: 0,
        afterBuffer: 5,
        slotInterval: 15,
        maxBookingsPerDay: 8,
        color: "#3B82F6",
        customQuestions: JSON.stringify([
          {
            id: "topic",
            type: "text",
            label: "What would you like to discuss?",
            required: true,
            placeholder: "Brief description of the topic...",
          },
        ]),
      },
      {
        title: "30 Minute Meeting",
        slug: "30-minute-meeting",
        description:
          "A comprehensive 30-minute meeting to dive deeper into your project requirements.",
        duration: 30,
        isActive: true,
        requiresConfirmation: false,
        minimumNotice: 120,
        beforeBuffer: 5,
        afterBuffer: 10,
        slotInterval: 30,
        maxBookingsPerDay: 6,
        color: "#10B981",
        customQuestions: JSON.stringify([
          {
            id: "company",
            type: "text",
            label: "Company/Organization",
            required: false,
            placeholder: "Your company name",
          },
          {
            id: "meeting_type",
            type: "select",
            label: "Meeting Type",
            required: true,
            options: [
              "Discovery Call",
              "Technical Discussion",
              "Project Planning",
              "Other",
            ],
          },
        ]),
      },
      {
        title: "60 Minute Consultation",
        slug: "60-minute-consultation",
        description:
          "An in-depth consultation session to thoroughly analyze your requirements and provide detailed recommendations.",
        duration: 60,
        isActive: true,
        requiresConfirmation: true,
        price: 15000, // $150.00
        currency: "USD",
        minimumNotice: 240,
        beforeBuffer: 10,
        afterBuffer: 15,
        slotInterval: 60,
        maxBookingsPerDay: 3,
        color: "#8B5CF6",
        customQuestions: JSON.stringify([
          {
            id: "project_details",
            type: "textarea",
            label: "Project Details",
            required: true,
            placeholder:
              "Please provide a detailed description of your project...",
          },
          {
            id: "budget_range",
            type: "select",
            label: "Budget Range",
            required: false,
            options: [
              "Under $10k",
              "$10k-$50k",
              "$50k-$100k",
              "$100k+",
              "Prefer not to say",
            ],
          },
          {
            id: "timeline",
            type: "select",
            label: "Desired Timeline",
            required: false,
            options: [
              "ASAP",
              "1-3 months",
              "3-6 months",
              "6+ months",
              "Flexible",
            ],
          },
        ]),
      },
      {
        title: "Technical Interview",
        slug: "technical-interview",
        description:
          "A 45-minute technical interview session for engineering positions.",
        duration: 45,
        isActive: true,
        requiresConfirmation: true,
        minimumNotice: 1440, // 24 hours
        beforeBuffer: 15,
        afterBuffer: 15,
        slotInterval: 45,
        maxBookingsPerDay: 4,
        color: "#EF4444",
        customQuestions: JSON.stringify([
          {
            id: "position",
            type: "text",
            label: "Position Applied For",
            required: true,
            placeholder: "e.g. Senior Frontend Developer",
          },
          {
            id: "experience",
            type: "select",
            label: "Years of Experience",
            required: true,
            options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"],
          },
          {
            id: "tech_stack",
            type: "checkbox",
            label: "Technical Skills (select all that apply)",
            required: true,
            options: [
              "JavaScript",
              "TypeScript",
              "React",
              "Node.js",
              "Python",
              "Go",
              "Java",
              "Other",
            ],
          },
        ]),
      },
      {
        title: "Pair Programming",
        slug: "pair-programming",
        description:
          "A collaborative 90-minute coding session where we work together on real problems.",
        duration: 90,
        isActive: true,
        requiresConfirmation: false,
        minimumNotice: 360,
        beforeBuffer: 30,
        afterBuffer: 30,
        slotInterval: 90,
        maxBookingsPerDay: 2,
        color: "#F59E0B",
        customQuestions: JSON.stringify([
          {
            id: "language",
            type: "select",
            label: "Preferred Programming Language",
            required: true,
            options: [
              "JavaScript",
              "TypeScript",
              "Python",
              "Go",
              "Rust",
              "Other",
            ],
          },
          {
            id: "problem_description",
            type: "textarea",
            label: "Problem Description",
            required: true,
            placeholder:
              "Describe the problem or feature you would like to work on...",
          },
        ]),
      },
      {
        title: "Coffee Chat",
        slug: "coffee-chat",
        description:
          "A casual 20-minute coffee chat to get to know each other.",
        duration: 20,
        isActive: false, // Inactive for demo
        requiresConfirmation: false,
        minimumNotice: 60,
        beforeBuffer: 0,
        afterBuffer: 0,
        slotInterval: 20,
        maxBookingsPerDay: 10,
        color: "#6B7280",
      },
    ];

    for (const eventTypeData of eventTypesData) {
      await prisma.eventType.upsert({
        where: {
          userId_slug: {
            userId: demoUser.id,
            slug: eventTypeData.slug,
          },
        },
        update: {},
        create: {
          ...eventTypeData,
          userId: demoUser.id,
          scheduleId: businessHoursSchedule.id,
        },
      });
    }

    console.log("Event types created/found");

    // 6. Create realistic bookings with varied attendees and times
    const now = new Date();
    const bookingsData = [
      // Past bookings (2)
      {
        uid: "bk_past_1_demo_showcase",
        title: "Quick Chat with Sarah",
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        duration: 15,
        status: "ACCEPTED",
        attendeeName: "Sarah Johnson",
        attendeeEmail: "sarah.johnson@techstart.com",
        attendeeTimezone: "America/Los_Angeles",
        attendeeNotes: "Interested in discussing a new project opportunity",
        meetingUrl: "https://meet.google.com/abc-defg-hij",
        location: "Google Meet",
        responses: JSON.stringify({
          topic: "New AI project development",
        }),
      },
      {
        uid: "bk_past_2_demo_showcase",
        title: "30 Minute Meeting with Michael",
        startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 30,
        status: "ACCEPTED",
        attendeeName: "Michael Chen",
        attendeeEmail: "michael.chen@innovatecorp.com",
        attendeeTimezone: "America/New_York",
        attendeeNotes: "Looking to modernize our legacy systems",
        meetingUrl: "https://zoom.us/j/1234567890",
        location: "Zoom",
        responses: JSON.stringify({
          company: "InnovateCorp",
          meeting_type: "Technical Discussion",
        }),
      },
      // Upcoming accepted bookings (8)
      {
        uid: "bk_upcoming_1_demo_showcase",
        title: "Quick Chat with Emma",
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 15,
        status: "ACCEPTED",
        attendeeName: "Emma Williams",
        attendeeEmail: "emma.williams@startup.io",
        attendeeTimezone: "America/Chicago",
        attendeeNotes: "First time founder seeking technical guidance",
        meetingUrl: "https://meet.google.com/xyz-uvwx-yz",
        location: "Google Meet",
        responses: JSON.stringify({
          topic: "Technical architecture consultation",
        }),
      },
      {
        uid: "bk_upcoming_2_demo_showcase",
        title: "60 Minute Consultation with David",
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        status: "ACCEPTED",
        attendeeName: "David Rodriguez",
        attendeeEmail: "david.rodriguez@enterprises.com",
        attendeeTimezone: "America/Denver",
        attendeeNotes: "Need comprehensive system architecture review",
        meetingUrl: "https://teams.microsoft.com/l/meetup-join/...",
        location: "Microsoft Teams",
        responses: JSON.stringify({
          project_details:
            "Looking to rebuild our customer portal with modern technologies. Current system is 10+ years old and struggling with scale.",
          budget_range: "$50k-$100k",
          timeline: "3-6 months",
        }),
      },
      {
        uid: "bk_upcoming_3_demo_showcase",
        title: "Technical Interview with Jessica",
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 45,
        status: "ACCEPTED",
        attendeeName: "Jessica Martinez",
        attendeeEmail: "jessica.martinez@gmail.com",
        attendeeTimezone: "America/Los_Angeles",
        attendeeNotes: "Excited about the opportunity!",
        meetingUrl: "https://meet.google.com/tech-interview-abc",
        location: "Google Meet",
        responses: JSON.stringify({
          position: "Senior Full-Stack Developer",
          experience: "5-10 years",
          tech_stack: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Python",
          ],
        }),
      },
      {
        uid: "bk_upcoming_4_demo_showcase",
        title: "30 Minute Meeting with Alex",
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 30,
        status: "ACCEPTED",
        attendeeName: "Alex Thompson",
        attendeeEmail: "alex.thompson@devagency.com",
        attendeeTimezone: "America/New_York",
        attendeeNotes: "Partnership discussion",
        meetingUrl: "https://whereby.com/alexdemo",
        location: "Whereby",
        responses: JSON.stringify({
          company: "Dev Agency",
          meeting_type: "Project Planning",
        }),
      },
      {
        uid: "bk_upcoming_5_demo_showcase",
        title: "Pair Programming with Jamie",
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 90,
        status: "ACCEPTED",
        attendeeName: "Jamie Lee",
        attendeeEmail: "jamie.lee@techie.dev",
        attendeeTimezone: "America/Pacific",
        attendeeNotes: "Looking forward to solving this together!",
        meetingUrl: "https://vscode.dev/liveshare/...",
        location: "VS Code Live Share",
        responses: JSON.stringify({
          language: "TypeScript",
          problem_description:
            "Building a real-time collaborative editor using WebSockets and operational transforms",
        }),
      },
      {
        uid: "bk_upcoming_6_demo_showcase",
        title: "Quick Chat with Ryan",
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 15,
        status: "ACCEPTED",
        attendeeName: "Ryan O'Connor",
        attendeeEmail: "ryan.oconnor@freelancer.com",
        attendeeTimezone: "America/Eastern",
        attendeeNotes: "Quick question about best practices",
        meetingUrl: "https://meet.google.com/quick-chat-ryan",
        location: "Google Meet",
        responses: JSON.stringify({
          topic: "Code review and refactoring strategies",
        }),
      },
      {
        uid: "bk_upcoming_7_demo_showcase",
        title: "60 Minute Consultation with Priya",
        startTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        duration: 60,
        status: "ACCEPTED",
        attendeeName: "Priya Patel",
        attendeeEmail: "priya.patel@globaltech.in",
        attendeeTimezone: "Asia/Kolkata",
        attendeeNotes: "International project with tight deadlines",
        meetingUrl: "https://meet.google.com/global-consult",
        location: "Google Meet",
        responses: JSON.stringify({
          project_details:
            "Building a multi-tenant SaaS platform for the Indian market with specific compliance requirements.",
          budget_range: "$10k-$50k",
          timeline: "1-3 months",
        }),
      },
      {
        uid: "bk_upcoming_8_demo_showcase",
        title: "Technical Interview with Marcus",
        startTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        duration: 45,
        status: "ACCEPTED",
        attendeeName: "Marcus Johnson",
        attendeeEmail: "marcus.johnson@topdev.com",
        attendeeTimezone: "America/Central",
        attendeeNotes: "Senior position, very experienced candidate",
        meetingUrl: "https://meet.google.com/senior-interview",
        location: "Google Meet",
        responses: JSON.stringify({
          position: "Lead Software Architect",
          experience: "10+ years",
          tech_stack: ["JavaScript", "TypeScript", "Go", "Python", "Java"],
        }),
      },
      // Pending bookings (3)
      {
        uid: "bk_pending_1_demo_showcase",
        title: "60 Minute Consultation with Lisa",
        startTime: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
        duration: 60,
        status: "PENDING",
        attendeeName: "Lisa Anderson",
        attendeeEmail: "lisa.anderson@bigcorp.com",
        attendeeTimezone: "America/New_York",
        attendeeNotes: "Large enterprise project, needs approval from team",
        responses: JSON.stringify({
          project_details:
            "Enterprise digital transformation initiative. Looking to modernize 15+ legacy applications across multiple departments.",
          budget_range: "$100k+",
          timeline: "6+ months",
        }),
      },
      {
        uid: "bk_pending_2_demo_showcase",
        title: "Pair Programming with Chen",
        startTime: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
        duration: 90,
        status: "PENDING",
        attendeeName: "Chen Wei",
        attendeeEmail: "chen.wei@algorithmic.ai",
        attendeeTimezone: "Asia/Shanghai",
        attendeeNotes: "Working on machine learning optimization",
        responses: JSON.stringify({
          language: "Python",
          problem_description:
            "Optimizing neural network training pipeline for faster convergence and better accuracy",
        }),
      },
      {
        uid: "bk_pending_3_demo_showcase",
        title: "30 Minute Meeting with Sofia",
        startTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        duration: 30,
        status: "PENDING",
        attendeeName: "Sofia Garcia",
        attendeeEmail: "sofia.garcia@consulting.es",
        attendeeTimezone: "Europe/Madrid",
        attendeeNotes: "Initial consultation for European expansion",
        responses: JSON.stringify({
          company: "Garcia Consulting",
          meeting_type: "Discovery Call",
        }),
      },
      // Cancelled bookings (2)
      {
        uid: "bk_cancelled_1_demo_showcase",
        title: "Quick Chat with Tom",
        startTime: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        duration: 15,
        status: "CANCELLED",
        attendeeName: "Tom Wilson",
        attendeeEmail: "tom.wilson@quickstart.com",
        attendeeTimezone: "America/Pacific",
        attendeeNotes: "Had to reschedule due to emergency",
        cancellationReason: "Unexpected client emergency came up",
        responses: JSON.stringify({
          topic: "Quick technical question",
        }),
      },
      {
        uid: "bk_cancelled_2_demo_showcase",
        title: "30 Minute Meeting with Kevin",
        startTime: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        duration: 30,
        status: "CANCELLED",
        attendeeName: "Kevin Brown",
        attendeeEmail: "kevin.brown@cancelledproject.com",
        attendeeTimezone: "America/Mountain",
        attendeeNotes: "Project was put on hold",
        cancellationReason: "Project timeline changed, no longer urgent",
        responses: JSON.stringify({
          company: "Cancelled Project Inc",
          meeting_type: "Project Planning",
        }),
      },
    ];

    // Get event types to assign to bookings
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: demoUser.id },
      select: { id: true, slug: true },
    });

    const eventTypeMap = eventTypes.reduce(
      (acc, et) => {
        acc[et.slug] = et.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    for (const bookingData of bookingsData) {
      // Determine event type based on title
      let eventTypeId = eventTypeMap["30-minute-meeting"]; // default
      if (bookingData.title.includes("Quick Chat")) {
        eventTypeId = eventTypeMap["quick-chat"];
      } else if (bookingData.title.includes("60 Minute Consultation")) {
        eventTypeId = eventTypeMap["60-minute-consultation"];
      } else if (bookingData.title.includes("Technical Interview")) {
        eventTypeId = eventTypeMap["technical-interview"];
      } else if (bookingData.title.includes("Pair Programming")) {
        eventTypeId = eventTypeMap["pair-programming"];
      }

      const endTime = new Date(
        bookingData.startTime.getTime() + bookingData.duration * 60 * 1000,
      );

      await prisma.booking.upsert({
        where: { uid: bookingData.uid },
        update: {},
        create: {
          uid: bookingData.uid,
          title: bookingData.title,
          startTime: bookingData.startTime,
          endTime: endTime,
          status: bookingData.status as any,
          attendeeName: bookingData.attendeeName,
          attendeeEmail: bookingData.attendeeEmail,
          attendeeTimezone: bookingData.attendeeTimezone,
          attendeeNotes: bookingData.attendeeNotes,
          meetingUrl: bookingData.meetingUrl,
          location: bookingData.location,
          responses: bookingData.responses,
          cancellationReason: bookingData.cancellationReason,
          userId: demoUser.id,
          eventTypeId: eventTypeId,
        },
      });
    }

    console.log("Bookings created/found");

    // 7. Create date overrides (2)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);

    // Create date overrides (idempotent check)
    const existingTomorrowOverride = await prisma.dateOverride.findFirst({
      where: {
        scheduleId: businessHoursSchedule.id,
        date: tomorrow,
      },
    });

    if (!existingTomorrowOverride) {
      await prisma.dateOverride.create({
        data: {
          date: tomorrow,
          isUnavailable: true,
          scheduleId: businessHoursSchedule.id,
        },
      });
    }

    const existingNextWeekOverride = await prisma.dateOverride.findFirst({
      where: {
        scheduleId: businessHoursSchedule.id,
        date: nextWeek,
      },
    });

    if (!existingNextWeekOverride) {
      await prisma.dateOverride.create({
        data: {
          date: nextWeek,
          startTime: "10:00",
          endTime: "15:00",
          isUnavailable: false,
          scheduleId: businessHoursSchedule.id,
        },
      });
    }

    console.log("Date overrides created/found");

    // 8. Create demo team
    const demoTeam = await prisma.team.upsert({
      where: { slug: "calmill-demo-team" },
      update: {},
      create: {
        name: "CalMill Demo Team",
        slug: "calmill-demo-team",
        bio: "A showcase team demonstrating CalMill's powerful team scheduling capabilities",
      },
    });

    // 9. Create team members
    // Add demo user as owner
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: demoUser.id,
          teamId: demoTeam.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        teamId: demoTeam.id,
        role: "OWNER",
        accepted: true,
      },
    });

    // Create Alice Johnson
    const aliceUser = await prisma.user.upsert({
      where: { email: "alice.johnson@calmill.demo" },
      update: {},
      create: {
        email: "alice.johnson@calmill.demo",
        username: "alice-johnson",
        name: "Alice Johnson",
        passwordHash: await bcryptjs.hash("demo1234", 12),
        timezone: "America/New_York",
        bio: "Product Manager with 8+ years of experience in building user-centric applications",
        theme: "light",
      },
    });

    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: aliceUser.id,
          teamId: demoTeam.id,
        },
      },
      update: {},
      create: {
        userId: aliceUser.id,
        teamId: demoTeam.id,
        role: "MEMBER",
        accepted: true,
      },
    });

    // Create Bob Smith
    const bobUser = await prisma.user.upsert({
      where: { email: "bob.smith@calmill.demo" },
      update: {},
      create: {
        email: "bob.smith@calmill.demo",
        username: "bob-smith",
        name: "Bob Smith",
        passwordHash: await bcryptjs.hash("demo1234", 12),
        timezone: "America/Los_Angeles",
        bio: "Senior Engineer specializing in scalable backend systems and API design",
        theme: "light",
      },
    });

    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: bobUser.id,
          teamId: demoTeam.id,
        },
      },
      update: {},
      create: {
        userId: bobUser.id,
        teamId: demoTeam.id,
        role: "MEMBER",
        accepted: true,
      },
    });

    console.log("Team and members created/found");

    // 10. Create team event types
    const existingTeamStandup = await prisma.eventType.findFirst({
      where: {
        teamId: demoTeam.id,
        slug: "team-standup",
      },
    });

    if (!existingTeamStandup) {
      await prisma.eventType.create({
        data: {
          title: "Team Standup",
          slug: "team-standup",
          description:
            "Daily team standup meeting to sync on progress and blockers",
          duration: 15,
          isActive: true,
          requiresConfirmation: false,
          minimumNotice: 60,
          beforeBuffer: 0,
          afterBuffer: 5,
          slotInterval: 15,
          maxBookingsPerDay: 4,
          color: "#059669",
          schedulingType: "ROUND_ROBIN",
          teamId: demoTeam.id,
          userId: demoUser.id, // Primary host
        },
      });
    }

    const existingGroupDemo = await prisma.eventType.findFirst({
      where: {
        teamId: demoTeam.id,
        slug: "group-demo",
      },
    });

    if (!existingGroupDemo) {
      await prisma.eventType.create({
        data: {
          title: "Group Demo",
          slug: "group-demo",
          description: "Product demo session with the entire team present",
          duration: 30,
          isActive: true,
          requiresConfirmation: true,
          minimumNotice: 240,
          beforeBuffer: 10,
          afterBuffer: 10,
          slotInterval: 30,
          maxBookingsPerDay: 2,
          color: "#DC2626",
          schedulingType: "COLLECTIVE",
          teamId: demoTeam.id,
          userId: demoUser.id, // Primary host
          customQuestions: JSON.stringify([
            {
              id: "demo_focus",
              type: "select",
              label: "What would you like to focus on?",
              required: true,
              options: [
                "Product Overview",
                "Technical Deep-dive",
                "Integration Capabilities",
                "Custom Requirements",
              ],
            },
            {
              id: "attendee_count",
              type: "select",
              label: "How many attendees from your side?",
              required: true,
              options: [
                "1-2 people",
                "3-5 people",
                "6-10 people",
                "10+ people",
              ],
            },
          ]),
        },
      });
    }

    console.log("Team event types created/found");

    const summary = {
      success: true,
      message: "Demo data seeded successfully",
      data: {
        users: {
          demo: demoUser.id,
          alice: aliceUser.id,
          bob: bobUser.id,
        },
        schedules: {
          business: businessHoursSchedule.id,
          extended: extendedHoursSchedule.id,
        },
        team: demoTeam.id,
        counts: {
          eventTypes: eventTypesData.length + 2, // individual + team
          bookings: bookingsData.length,
          availability:
            businessHoursAvailability.length + extendedHoursAvailability.length,
          dateOverrides: 2,
          teamMembers: 3,
        },
      },
    };

    console.log("Seed completed successfully:", summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      {
        error: "internal",
        message: "Failed to seed database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
