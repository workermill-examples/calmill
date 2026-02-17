import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

// ─── VALIDATION ───────────────────────────────────────────────────────────────

const VALID_TRIGGERS = [
  "BOOKING_CREATED",
  "BOOKING_CANCELLED",
  "BOOKING_RESCHEDULED",
  "BOOKING_ACCEPTED",
  "BOOKING_REJECTED",
] as const;

const webhookCreateSchema = z.object({
  url: z
    .string()
    .url("Invalid webhook URL")
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return (
            parsed.protocol === "https:" ||
            parsed.hostname === "localhost" ||
            parsed.hostname === "127.0.0.1"
          );
        } catch {
          return false;
        }
      },
      { message: "Webhook URL must use HTTPS (localhost allowed for development)" }
    ),
  eventTriggers: z
    .array(z.enum(VALID_TRIGGERS))
    .min(1, "At least one event trigger is required"),
  active: z.boolean().optional().default(true),
});

// ─── GET /api/webhooks — List user's webhooks ─────────────────────────────────

export async function GET() {
  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const webhooks = await prisma.webhook.findMany({
      where: { userId: user.id },
      include: {
        deliveries: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            success: true,
            statusCode: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Shape the response: include last delivery status, mask the secret
    const data = webhooks.map((webhook) => ({
      id: webhook.id,
      url: webhook.url,
      eventTriggers: webhook.eventTriggers,
      active: webhook.active,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
      lastDelivery: webhook.deliveries[0] ?? null,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/webhooks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/webhooks — Create webhook ──────────────────────────────────────

export async function POST(request: Request) {
  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const body = await request.json();
    const validated = webhookCreateSchema.parse(body);

    // Generate a cryptographically secure secret
    const secret = randomBytes(32).toString("hex");

    const webhook = await prisma.webhook.create({
      data: {
        url: validated.url,
        eventTriggers: validated.eventTriggers,
        active: validated.active,
        secret,
        userId: user.id,
      },
    });

    // Return the secret only on creation
    return NextResponse.json(
      {
        success: true,
        data: {
          id: webhook.id,
          url: webhook.url,
          eventTriggers: webhook.eventTriggers,
          active: webhook.active,
          secret: webhook.secret, // shown only once
          createdAt: webhook.createdAt,
          updatedAt: webhook.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("POST /api/webhooks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
