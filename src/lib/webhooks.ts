import { createHmac, randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type WebhookEventType =
  | "BOOKING_CREATED"
  | "BOOKING_CANCELLED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_ACCEPTED"
  | "BOOKING_REJECTED";

export interface WebhookPayload {
  event: WebhookEventType;
  createdAt: string;
  data: {
    booking: {
      uid: string;
      title: string;
      startTime: string;
      endTime: string;
      status: string;
      attendee: {
        name: string;
        email: string;
        timezone: string;
      };
      eventType: {
        title: string;
        slug: string;
        duration: number;
      };
    };
  };
}

// ─── SIGNING ─────────────────────────────────────────────────────────────────

function signPayload(secret: string, payloadBody: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(payloadBody);
  return `sha256=${hmac.digest("hex")}`;
}

// ─── DELIVERY ─────────────────────────────────────────────────────────────────

/**
 * Delivers a webhook event to all active webhooks subscribed to the event type.
 * Fire-and-forget — call with void and don't await.
 */
export async function deliverWebhookEvent(params: {
  userId: string;
  eventType: WebhookEventType;
  payload: WebhookPayload;
}): Promise<void> {
  const { userId, eventType, payload } = params;

  // Find all active webhooks for this user that subscribe to this event type
  const webhooks = await prisma.webhook.findMany({
    where: {
      userId,
      active: true,
      eventTriggers: {
        has: eventType,
      },
    },
  });

  if (webhooks.length === 0) return;

  const payloadBody = JSON.stringify(payload);

  // Deliver to each webhook (in parallel, fire-and-forget per webhook)
  await Promise.allSettled(
    webhooks.map((webhook) => deliverToWebhook(webhook, eventType, payload, payloadBody))
  );
}

async function deliverToWebhook(
  webhook: {
    id: string;
    url: string;
    secret: string | null;
  },
  eventType: WebhookEventType,
  payload: WebhookPayload,
  payloadBody: string
): Promise<void> {
  const deliveryId = randomUUID();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-CalMill-Event": eventType,
    "X-CalMill-Delivery": deliveryId,
  };

  if (webhook.secret) {
    headers["X-CalMill-Signature"] = signPayload(webhook.secret, payloadBody);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  let statusCode: number | undefined;
  let success = false;
  let errorMessage: string | undefined;

  try {
    const response = await fetch(webhook.url, {
      method: "POST",
      headers,
      body: payloadBody,
      signal: controller.signal,
    });

    statusCode = response.status;
    success = response.ok;

    if (!response.ok) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
  } catch (err) {
    if (err instanceof Error) {
      errorMessage = err.name === "AbortError" ? "Request timed out after 10s" : err.message;
    } else {
      errorMessage = "Unknown delivery error";
    }
  } finally {
    clearTimeout(timeout);
  }

  // Log delivery result (non-blocking — don't let DB failure propagate)
  try {
    await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        eventType,
        payload: payload as unknown as Prisma.InputJsonValue,
        statusCode: statusCode ?? null,
        success,
        error: errorMessage ?? null,
        deliveryId,
      },
    });
  } catch (dbErr) {
    console.error("[Webhooks] Failed to log delivery:", dbErr);
  }

  if (!success) {
    console.error(
      `[Webhooks] Delivery to ${webhook.url} failed (${errorMessage ?? `HTTP ${statusCode}`})`
    );
  }
}

// ─── TEST DELIVERY ────────────────────────────────────────────────────────────

/**
 * Sends a test payload to a webhook URL.
 * Returns { success, statusCode, error } — does NOT log to DB.
 */
export async function sendTestWebhook(params: {
  url: string;
  secret: string | null;
}): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  const { url, secret } = params;
  const deliveryId = randomUUID();

  const testPayload: WebhookPayload = {
    event: "BOOKING_CREATED",
    createdAt: new Date().toISOString(),
    data: {
      booking: {
        uid: "test-booking-uid",
        title: "Test Booking",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        status: "ACCEPTED",
        attendee: {
          name: "Test Attendee",
          email: "test@example.com",
          timezone: "America/New_York",
        },
        eventType: {
          title: "30 Minute Meeting",
          slug: "30min",
          duration: 30,
        },
      },
    },
  };

  const payloadBody = JSON.stringify(testPayload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-CalMill-Event": "BOOKING_CREATED",
    "X-CalMill-Delivery": deliveryId,
    "X-CalMill-Test": "true",
  };

  if (secret) {
    headers["X-CalMill-Signature"] = signPayload(secret, payloadBody);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: payloadBody,
      signal: controller.signal,
    });

    return { success: response.ok, statusCode: response.status };
  } catch (err) {
    const error =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Request timed out after 10s"
          : err.message
        : "Unknown error";
    return { success: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── PAYLOAD BUILDER ─────────────────────────────────────────────────────────

export function buildBookingPayload(
  event: WebhookEventType,
  booking: {
    uid: string;
    title: string;
    startTime: Date;
    endTime: Date;
    status: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeeTimezone: string;
    eventType: {
      title: string;
      slug: string;
      duration: number;
    };
  }
): WebhookPayload {
  return {
    event,
    createdAt: new Date().toISOString(),
    data: {
      booking: {
        uid: booking.uid,
        title: booking.title,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
        attendee: {
          name: booking.attendeeName,
          email: booking.attendeeEmail,
          timezone: booking.attendeeTimezone,
        },
        eventType: {
          title: booking.eventType.title,
          slug: booking.eventType.slug,
          duration: booking.eventType.duration,
        },
      },
    },
  };
}
