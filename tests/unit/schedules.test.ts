import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPrismaClient, mockSession } from '../helpers/setup';

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient,
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: vi.fn((data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
      body: JSON.stringify(data),
      _data: data,
      _status: init?.status ?? 200,
    })) as unknown as any,
  },
}));

// ─── IMPORTS ─────────────────────────────────────────────────────────────────

import { GET as _listSchedules, POST as _createSchedule } from '@/app/api/schedules/route';
// Cast handlers to any so TypeScript accepts _data/_status on mock responses
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listSchedules = _listSchedules as (...args: any[]) => Promise<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSchedule = _createSchedule as (...args: any[]) => Promise<any>;
import { scheduleCreateSchema } from '@/lib/validations';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function makeRequest(body?: unknown, method = 'GET'): Request {
  return {
    method,
    json: async () => body,
    url: 'http://localhost:3000/api/schedules',
    headers: new Headers(),
  } as unknown as Request;
}

const mockContext = { params: Promise.resolve({}) };

const mockSchedule = {
  id: 'schedule-1',
  name: 'Business Hours',
  timezone: 'America/New_York',
  isDefault: true,
  userId: 'demo-user-id',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  availability: [
    { id: 'avail-1', scheduleId: 'schedule-1', day: 1, startTime: '09:00', endTime: '17:00' },
    { id: 'avail-2', scheduleId: 'schedule-1', day: 2, startTime: '09:00', endTime: '17:00' },
    { id: 'avail-3', scheduleId: 'schedule-1', day: 3, startTime: '09:00', endTime: '17:00' },
    { id: 'avail-4', scheduleId: 'schedule-1', day: 4, startTime: '09:00', endTime: '17:00' },
    { id: 'avail-5', scheduleId: 'schedule-1', day: 5, startTime: '09:00', endTime: '17:00' },
  ],
  dateOverrides: [],
  _count: { eventTypes: 2 },
};

const validCreateBody = {
  name: 'Business Hours',
  timezone: 'America/New_York',
  isDefault: true,
  availability: [
    { day: 1, startTime: '09:00', endTime: '17:00' },
    { day: 2, startTime: '09:00', endTime: '17:00' },
    { day: 3, startTime: '09:00', endTime: '17:00' },
    { day: 4, startTime: '09:00', endTime: '17:00' },
    { day: 5, startTime: '09:00', endTime: '17:00' },
  ],
};

// ─── GET /api/schedules ──────────────────────────────────────────────────────

describe('GET /api/schedules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list of schedules for authenticated user', async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([mockSchedule]);

    const request = makeRequest(undefined, 'GET');
    const response = await listSchedules(request, mockContext);

    expect(response._status).toBe(200);
    expect(response._data.success).toBe(true);
    expect(response._data.data).toHaveLength(1);
    expect(response._data.data[0].name).toBe('Business Hours');
  });

  it("queries only the authenticated user's schedules", async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([]);

    const request = makeRequest(undefined, 'GET');
    await listSchedules(request, mockContext);

    expect(mockPrismaClient.schedule.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: mockSession.user.id },
      })
    );
  });

  it('includes availability and dateOverrides in the response', async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([mockSchedule]);

    const request = makeRequest(undefined, 'GET');
    const response = await listSchedules(request, mockContext);

    const schedule = response._data.data[0];
    expect(schedule.availability).toBeDefined();
    expect(schedule.availability).toHaveLength(5);
    expect(schedule.dateOverrides).toBeDefined();
  });

  it('includes event type count', async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([mockSchedule]);

    const request = makeRequest(undefined, 'GET');
    const response = await listSchedules(request, mockContext);

    expect(response._data.data[0]._count.eventTypes).toBe(2);
  });

  it('returns empty array when user has no schedules', async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([]);

    const request = makeRequest(undefined, 'GET');
    const response = await listSchedules(request, mockContext);

    expect(response._data.success).toBe(true);
    expect(response._data.data).toHaveLength(0);
  });

  it('returns 500 on database error', async () => {
    mockPrismaClient.schedule.findMany.mockRejectedValue(new Error('DB error'));

    const request = makeRequest(undefined, 'GET');
    const response = await listSchedules(request, mockContext);

    expect(response._status).toBe(500);
    expect(response._data.error).toBe('Internal server error');
  });
});

// ─── POST /api/schedules ─────────────────────────────────────────────────────

describe('POST /api/schedules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrismaClient.schedule.create.mockResolvedValue(mockSchedule);
    mockPrismaClient.schedule.updateMany.mockResolvedValue({ count: 0 });
  });

  it('creates a schedule with valid data', async () => {
    const request = makeRequest(validCreateBody, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(201);
    expect(response._data.success).toBe(true);
    expect(mockPrismaClient.schedule.create).toHaveBeenCalledTimes(1);
  });

  it('validates timezone against Intl.supportedValuesOf', async () => {
    const body = {
      ...validCreateBody,
      timezone: 'Invalid/Timezone',
    };

    const request = makeRequest(body, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe('Invalid timezone');
  });

  it('accepts valid IANA timezone', async () => {
    const body = {
      ...validCreateBody,
      timezone: 'Europe/London',
    };

    const request = makeRequest(body, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(201);
  });

  it('unsets existing default schedule when isDefault is true', async () => {
    const body = { ...validCreateBody, isDefault: true };

    const request = makeRequest(body, 'POST');
    await createSchedule(request, mockContext);

    expect(mockPrismaClient.schedule.updateMany).toHaveBeenCalledWith({
      where: { userId: mockSession.user.id, isDefault: true },
      data: { isDefault: false },
    });
  });

  it('does NOT unset default schedule when isDefault is false', async () => {
    const body = { ...validCreateBody, isDefault: false };

    const request = makeRequest(body, 'POST');
    await createSchedule(request, mockContext);

    expect(mockPrismaClient.schedule.updateMany).not.toHaveBeenCalled();
  });

  it('creates availability slots for the new schedule', async () => {
    const request = makeRequest(validCreateBody, 'POST');
    await createSchedule(request, mockContext);

    expect(mockPrismaClient.schedule.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          availability: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({ day: 1, startTime: '09:00', endTime: '17:00' }),
            ]),
          }),
        }),
      })
    );
  });

  it('returns 400 on missing availability array', async () => {
    const body = {
      name: 'My Schedule',
      timezone: 'UTC',
      availability: [],
    };

    const request = makeRequest(body, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(400);
    expect(response._data.error).toBe('Validation failed');
  });

  it('returns 400 when name is missing', async () => {
    const body = {
      timezone: 'UTC',
      availability: [{ day: 1, startTime: '09:00', endTime: '17:00' }],
    };

    const request = makeRequest(body, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(400);
  });

  it('sets userId from authenticated session', async () => {
    const request = makeRequest(validCreateBody, 'POST');
    await createSchedule(request, mockContext);

    expect(mockPrismaClient.schedule.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: mockSession.user.id,
        }),
      })
    );
  });

  it('returns 500 on database error during creation', async () => {
    mockPrismaClient.schedule.create.mockRejectedValue(new Error('DB write error'));

    const request = makeRequest(validCreateBody, 'POST');
    const response = await createSchedule(request, mockContext);

    expect(response._status).toBe(500);
  });
});

// ─── scheduleCreateSchema validation ────────────────────────────────────────

describe('scheduleCreateSchema', () => {
  it('accepts valid schedule data', () => {
    const result = scheduleCreateSchema.safeParse(validCreateBody);
    expect(result.success).toBe(true);
  });

  it('rejects empty availability array', () => {
    const result = scheduleCreateSchema.safeParse({
      name: 'Schedule',
      timezone: 'UTC',
      availability: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid time format in availability', () => {
    const result = scheduleCreateSchema.safeParse({
      name: 'Schedule',
      timezone: 'UTC',
      availability: [{ day: 1, startTime: '9:00', endTime: '17:00' }], // single digit hour
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid day of week (> 6)', () => {
    const result = scheduleCreateSchema.safeParse({
      name: 'Schedule',
      timezone: 'UTC',
      availability: [{ day: 7, startTime: '09:00', endTime: '17:00' }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts all 7 days (0-6)', () => {
    const result = scheduleCreateSchema.safeParse({
      name: 'Schedule',
      timezone: 'UTC',
      availability: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        startTime: '09:00',
        endTime: '17:00',
      })),
    });
    expect(result.success).toBe(true);
  });
});
