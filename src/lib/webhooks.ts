import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export interface WebhookEvent {
  id: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
}

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

/**
 * Deliver webhook payload to a single endpoint
 */
export async function deliverWebhook(
  url: string,
  event: WebhookEvent,
  secret: string
): Promise<WebhookDeliveryResult> {
  const payload = JSON.stringify(event);
  const signature = generateWebhookSignature(payload, secret);
  const deliveryId = crypto.randomUUID();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CalMill-Signature': signature,
        'X-CalMill-Event': event.event,
        'X-CalMill-Delivery': deliveryId,
        'User-Agent': 'CalMill-Webhooks/1.0',
      },
      body: payload,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return {
      success: response.ok,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fire-and-forget webhook delivery to all active webhooks for a user
 */
export async function triggerWebhooks(
  userId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  // Fire-and-forget: don't await the result
  void processWebhookDeliveries(userId, event, data);
}

/**
 * Process webhook deliveries for a user and event
 */
async function processWebhookDeliveries(
  userId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    // Find all active webhooks for this user that listen to this event
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        active: true,
        eventTriggers: {
          has: event,
        },
      },
    });

    if (webhooks.length === 0) {
      return;
    }

    const webhookEvent: WebhookEvent = {
      id: crypto.randomUUID(),
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    // Process all webhook deliveries in parallel
    const deliveryPromises = webhooks.map(async (webhook) => {
      const result = await deliverWebhook(webhook.url, webhookEvent, webhook.secret);

      // Log delivery attempt to database
      try {
        await prisma.webhookDelivery.create({
          data: {
            webhookId: webhook.id,
            event: webhookEvent.event,
            payload: webhookEvent as any,
            statusCode: result.statusCode,
            error: result.error,
          },
        });
      } catch (error) {
        // Silently fail if we can't log the delivery - don't break the webhook system
        console.error('Failed to log webhook delivery:', error);
      }
    });

    // Wait for all deliveries to complete, but don't propagate errors
    await Promise.allSettled(deliveryPromises);
  } catch (error) {
    // Silently fail - webhook delivery should never break the main application flow
    console.error('Failed to process webhook deliveries:', error);
  }
}

/**
 * Test webhook delivery (used by test endpoint)
 */
export async function testWebhookDelivery(
  webhookId: string,
  userId: string
): Promise<WebhookDeliveryResult> {
  try {
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        userId,
      },
    });

    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found',
      };
    }

    const testEvent: WebhookEvent = {
      id: crypto.randomUUID(),
      event: 'WEBHOOK_TEST',
      data: {
        message: 'This is a test webhook delivery from CalMill',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    const result = await deliverWebhook(webhook.url, testEvent, webhook.secret);

    // Log test delivery
    try {
      await prisma.webhookDelivery.create({
        data: {
          webhookId: webhook.id,
          event: testEvent.event,
          payload: testEvent as any,
          statusCode: result.statusCode,
          error: result.error,
        },
      });
    } catch (error) {
      console.error('Failed to log test webhook delivery:', error);
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Common webhook event types
export const WEBHOOK_EVENTS = {
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_RESCHEDULED: 'BOOKING_RESCHEDULED',
  BOOKING_ACCEPTED: 'BOOKING_ACCEPTED',
  BOOKING_REJECTED: 'BOOKING_REJECTED',
} as const;

export type WebhookEventType = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS];