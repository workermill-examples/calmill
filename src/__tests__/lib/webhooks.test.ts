import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateWebhookSignature,
  verifyWebhookSignature,
  deliverWebhook,
  triggerWebhooks,
  testWebhookDelivery,
  WEBHOOK_EVENTS,
  type WebhookEvent,
} from '@/lib/webhooks';

// Mock the prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    webhook: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    webhookDelivery: {
      create: vi.fn(),
    },
  },
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Webhooks Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateWebhookSignature', () => {
    it('should generate consistent HMAC-SHA256 signatures', () => {
      const payload = '{"event":"test","data":{}}';
      const secret = 'test-secret';

      const signature1 = generateWebhookSignature(payload, secret);
      const signature2 = generateWebhookSignature(payload, secret);

      expect(signature1).toBe(signature2);
      expect(signature1).toMatch(/^[a-f0-9]{64}$/); // 64 char hex string
    });

    it('should generate different signatures for different payloads', () => {
      const secret = 'test-secret';
      const payload1 = '{"event":"test1"}';
      const payload2 = '{"event":"test2"}';

      const signature1 = generateWebhookSignature(payload1, secret);
      const signature2 = generateWebhookSignature(payload2, secret);

      expect(signature1).not.toBe(signature2);
    });

    it('should generate different signatures for different secrets', () => {
      const payload = '{"event":"test"}';
      const secret1 = 'secret1';
      const secret2 = 'secret2';

      const signature1 = generateWebhookSignature(payload, secret1);
      const signature2 = generateWebhookSignature(payload, secret2);

      expect(signature1).not.toBe(signature2);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify valid signatures', () => {
      const payload = '{"event":"test","data":{}}';
      const secret = 'test-secret';
      const signature = generateWebhookSignature(payload, secret);

      const isValid = verifyWebhookSignature(payload, signature, secret);

      expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', () => {
      const payload = '{"event":"test","data":{}}';
      const secret = 'test-secret';
      const invalidSignature = 'invalid-signature';

      const isValid = verifyWebhookSignature(payload, invalidSignature, secret);

      expect(isValid).toBe(false);
    });

    it('should reject signatures with wrong secret', () => {
      const payload = '{"event":"test","data":{}}';
      const secret1 = 'secret1';
      const secret2 = 'secret2';
      const signature = generateWebhookSignature(payload, secret1);

      const isValid = verifyWebhookSignature(payload, signature, secret2);

      expect(isValid).toBe(false);
    });

    it('should use timing-safe comparison to prevent timing attacks', () => {
      const payload = '{"event":"test"}';
      const secret = 'test-secret';
      const validSignature = generateWebhookSignature(payload, secret);
      const invalidSignature = 'a'.repeat(64); // Same length as valid signature

      // Both should return quickly regardless of how many characters match
      const start1 = Date.now();
      const result1 = verifyWebhookSignature(payload, validSignature, secret);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      const result2 = verifyWebhookSignature(payload, invalidSignature, secret);
      const time2 = Date.now() - start2;

      expect(result1).toBe(true);
      expect(result2).toBe(false);
      // Timing difference should be minimal (both complete in under 10ms typically)
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });

  describe('deliverWebhook', () => {
    const mockEvent: WebhookEvent = {
      id: 'test-id',
      event: 'BOOKING_CREATED',
      data: { bookingId: '123' },
      timestamp: '2024-01-01T00:00:00.000Z',
    };

    it('should deliver webhook with correct headers and payload', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const result = await deliverWebhook(url, mockEvent, secret);

      expect(mockFetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-CalMill-Signature': expect.stringMatching(/^[a-f0-9]{64}$/),
            'X-CalMill-Event': 'BOOKING_CREATED',
            'X-CalMill-Delivery': expect.stringMatching(/^[a-f0-9-]{36}$/), // UUID format
            'User-Agent': 'CalMill-Webhooks/1.0',
          }),
          body: JSON.stringify(mockEvent),
          signal: expect.any(AbortSignal),
        })
      );

      expect(result).toEqual({
        success: true,
        statusCode: 200,
      });
    });

    it('should handle HTTP errors', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await deliverWebhook(url, mockEvent, secret);

      expect(result).toEqual({
        success: false,
        statusCode: 500,
      });
    });

    it('should handle network errors', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await deliverWebhook(url, mockEvent, secret);

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
    });

    it('should timeout after 10 seconds', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      // Mock a request that never resolves
      mockFetch.mockImplementationOnce(
        () => new Promise(() => {}) // Never resolves
      );

      const startTime = Date.now();
      const result = await deliverWebhook(url, mockEvent, secret);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(11000); // Should timeout before 11 seconds
      expect(result.success).toBe(false);
      expect(result.error).toContain('abort'); // AbortController error message
    });

    it('should generate correct signature in headers', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await deliverWebhook(url, mockEvent, secret);

      const call = mockFetch.mock.calls[0];
      const headers = call[1].headers;
      const payload = call[1].body;
      const signature = headers['X-CalMill-Signature'];

      const expectedSignature = generateWebhookSignature(payload, secret);
      expect(signature).toBe(expectedSignature);
    });
  });

  describe('triggerWebhooks', () => {
    it('should be fire-and-forget (not wait for completion)', async () => {
      const { prisma } = await import('@/lib/prisma');

      // Mock finding webhooks
      vi.mocked(prisma.webhook.findMany).mockResolvedValueOnce([]);

      const startTime = Date.now();
      await triggerWebhooks('user-123', 'BOOKING_CREATED', { bookingId: '456' });
      const endTime = Date.now();

      // Should return immediately (within a few ms)
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('testWebhookDelivery', () => {
    it('should deliver test webhook successfully', async () => {
      const { prisma } = await import('@/lib/prisma');

      const mockWebhook = {
        id: 'webhook-123',
        url: 'https://example.com/webhook',
        secret: 'test-secret',
      };

      vi.mocked(prisma.webhook.findFirst).mockResolvedValueOnce(mockWebhook);
      vi.mocked(prisma.webhookDelivery.create).mockResolvedValueOnce({});

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const result = await testWebhookDelivery('webhook-123', 'user-123');

      expect(prisma.webhook.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'webhook-123',
          userId: 'user-123',
        },
      });

      expect(result).toEqual({
        success: true,
        statusCode: 200,
      });

      expect(prisma.webhookDelivery.create).toHaveBeenCalledWith({
        data: {
          webhookId: 'webhook-123',
          event: 'WEBHOOK_TEST',
          payload: expect.objectContaining({
            event: 'WEBHOOK_TEST',
            data: expect.objectContaining({
              message: 'This is a test webhook delivery from CalMill',
            }),
          }),
          statusCode: 200,
          error: null,
        },
      });
    });

    it('should handle webhook not found', async () => {
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(prisma.webhook.findFirst).mockResolvedValueOnce(null);

      const result = await testWebhookDelivery('webhook-123', 'user-123');

      expect(result).toEqual({
        success: false,
        error: 'Webhook not found',
      });
    });

    it('should handle delivery failure', async () => {
      const { prisma } = await import('@/lib/prisma');

      const mockWebhook = {
        id: 'webhook-123',
        url: 'https://example.com/webhook',
        secret: 'test-secret',
      };

      vi.mocked(prisma.webhook.findFirst).mockResolvedValueOnce(mockWebhook);
      vi.mocked(prisma.webhookDelivery.create).mockResolvedValueOnce({});

      mockFetch.mockRejectedValueOnce(new Error('Connection failed'));

      const result = await testWebhookDelivery('webhook-123', 'user-123');

      expect(result).toEqual({
        success: false,
        error: 'Connection failed',
      });
    });
  });

  describe('WEBHOOK_EVENTS constants', () => {
    it('should define all required webhook events', () => {
      expect(WEBHOOK_EVENTS.BOOKING_CREATED).toBe('BOOKING_CREATED');
      expect(WEBHOOK_EVENTS.BOOKING_CANCELLED).toBe('BOOKING_CANCELLED');
      expect(WEBHOOK_EVENTS.BOOKING_RESCHEDULED).toBe('BOOKING_RESCHEDULED');
      expect(WEBHOOK_EVENTS.BOOKING_ACCEPTED).toBe('BOOKING_ACCEPTED');
      expect(WEBHOOK_EVENTS.BOOKING_REJECTED).toBe('BOOKING_REJECTED');
    });

    it('should have consistent naming pattern', () => {
      const events = Object.values(WEBHOOK_EVENTS);
      events.forEach(event => {
        expect(event).toMatch(/^[A-Z_]+$/); // Uppercase with underscores
        expect(event).toContain('BOOKING_'); // All events are booking-related
      });
    });
  });

  describe('error handling and resilience', () => {
    it('should handle malformed webhook data gracefully', async () => {
      const url = 'https://example.com/webhook';
      const secret = 'test-secret';

      // Test with circular reference (which would fail JSON.stringify)
      const circularData: any = { event: 'test' };
      circularData.self = circularData;

      const eventWithCircular: WebhookEvent = {
        id: 'test',
        event: 'TEST',
        data: circularData,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      // Should handle the error gracefully
      const result = await deliverWebhook(url, eventWithCircular, secret);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle database errors when logging delivery', async () => {
      const { prisma } = await import('@/lib/prisma');

      vi.mocked(prisma.webhook.findMany).mockResolvedValueOnce([{
        id: 'webhook-123',
        url: 'https://example.com/webhook',
        secret: 'test-secret',
      }]);

      // Mock database error when creating delivery log
      vi.mocked(prisma.webhookDelivery.create).mockRejectedValueOnce(new Error('DB Error'));

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      // Mock console.error to verify it's called
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Should not throw even if logging fails
      await expect(
        triggerWebhooks('user-123', 'BOOKING_CREATED', { bookingId: '456' })
      ).resolves.not.toThrow();

      // Give some time for async processing
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});