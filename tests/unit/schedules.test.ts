import { describe, it, expect } from "vitest";
import { mockPrismaClient } from "../helpers/setup";

const { GET: getSchedules, POST: postSchedule } = await import(
  "@/app/api/schedules/route"
);
const {
  GET: getSchedule,
  PUT: putSchedule,
  DELETE: deleteSchedule,
} = await import("@/app/api/schedules/[id]/route");
const { GET: getOverrides, POST: postOverride } = await import(
  "@/app/api/schedules/[id]/overrides/route"
);
const { DELETE: deleteOverride } = await import(
  "@/app/api/schedules/[id]/overrides/[overrideId]/route"
);

const makeRequest = (body?: unknown): Request =>
  ({
    json: async () => body,
    headers: new Headers(),
  }) as unknown as Request;

const makeContext = (params: Record<string, string> = { id: "schedule-id-1" }) => ({
  params: Promise.resolve(params),
});

const mockSchedule = {
  id: "schedule-id-1",
  name: "Business Hours",
  timezone: "America/New_York",
  isDefault: true,
  userId: "demo-user-id",
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: [
    { id: "avail-1", day: 1, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
    { id: "avail-2", day: 2, startTime: "09:00", endTime: "17:00", scheduleId: "schedule-id-1" },
  ],
  dateOverrides: [],
  _count: { eventTypes: 2 },
};

const validScheduleInput = {
  name: "Business Hours",
  timezone: "America/New_York",
  availability: [
    { day: 1, startTime: "09:00", endTime: "17:00" },
    { day: 2, startTime: "09:00", endTime: "17:00" },
  ],
};

describe("GET /api/schedules", () => {
  it("returns list of schedules for authenticated user", async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([mockSchedule]);

    const response = await getSchedules(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].name).toBe("Business Hours");
  });

  it("returns empty array when user has no schedules", async () => {
    mockPrismaClient.schedule.findMany.mockResolvedValue([]);

    const response = await getSchedules(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(0);
  });
});

describe("POST /api/schedules", () => {
  it("creates schedule with valid data", async () => {
    mockPrismaClient.schedule.updateMany.mockResolvedValue({ count: 0 });
    mockPrismaClient.schedule.create.mockResolvedValue(mockSchedule);
    mockPrismaClient.availability.create.mockResolvedValue({});

    const request = makeRequest(validScheduleInput);
    const response = await postSchedule(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("returns 400 for missing availability", async () => {
    const request = makeRequest({ name: "Test", timezone: "America/New_York" });
    const response = await postSchedule(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it("returns 400 for invalid timezone", async () => {
    const request = makeRequest({
      ...validScheduleInput,
      timezone: "Invalid/Timezone",
    });
    const response = await postSchedule(request, makeContext());

    expect(response.status).toBe(400);
  });

  it("unsets other default schedules when isDefault is true", async () => {
    mockPrismaClient.schedule.updateMany.mockResolvedValue({ count: 1 });
    mockPrismaClient.schedule.create.mockResolvedValue({ ...mockSchedule, isDefault: true });
    mockPrismaClient.availability.create.mockResolvedValue({});

    const request = makeRequest({ ...validScheduleInput, isDefault: true });
    await postSchedule(request, makeContext());

    expect(mockPrismaClient.schedule.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: "demo-user-id", isDefault: true }),
        data: { isDefault: false },
      })
    );
  });
});

describe("GET /api/schedules/[id]", () => {
  it("returns schedule for owner", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue(mockSchedule);

    const response = await getSchedule(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.id).toBe("schedule-id-1");
  });

  it("returns 404 when schedule not found", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue(null);

    const response = await getSchedule(makeRequest(), makeContext({ id: "nonexistent" }));
    expect(response.status).toBe(404);
  });

  it("returns 403 when user does not own the schedule", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue({
      ...mockSchedule,
      userId: "other-user-id",
    });

    const response = await getSchedule(makeRequest(), makeContext());
    expect(response.status).toBe(403);
  });
});

describe("PUT /api/schedules/[id]", () => {
  it("replaces availability on update", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue(mockSchedule);
    mockPrismaClient.schedule.updateMany.mockResolvedValue({ count: 0 });
    mockPrismaClient.schedule.update.mockResolvedValue(mockSchedule);
    mockPrismaClient.availability.deleteMany.mockResolvedValue({ count: 2 });
    mockPrismaClient.availability.create.mockResolvedValue({});

    const request = makeRequest(validScheduleInput);
    const response = await putSchedule(request, makeContext());
    await response.json();

    expect(response.status).toBe(200);
    expect(mockPrismaClient.availability.deleteMany).toHaveBeenCalled();
  });
});

describe("DELETE /api/schedules/[id]", () => {
  it("deletes schedule with no event type references", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue({
      id: "schedule-id-1",
      userId: "demo-user-id",
    });
    mockPrismaClient.schedule.count.mockResolvedValue(2); // user has 2 schedules
    mockPrismaClient.eventType.count.mockResolvedValue(0); // no references
    mockPrismaClient.schedule.delete.mockResolvedValue(mockSchedule);

    const response = await deleteSchedule(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 409 when event types reference this schedule", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue({
      id: "schedule-id-1",
      userId: "demo-user-id",
    });
    mockPrismaClient.schedule.count.mockResolvedValue(2); // user has 2 schedules
    mockPrismaClient.eventType.count.mockResolvedValue(3); // 3 event types reference this

    const response = await deleteSchedule(makeRequest(), makeContext());
    expect(response.status).toBe(409);
  });

  it("returns 409 when it is the only schedule", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue({
      id: "schedule-id-1",
      userId: "demo-user-id",
    });
    mockPrismaClient.schedule.count.mockResolvedValue(1); // only one schedule

    const response = await deleteSchedule(makeRequest(), makeContext());
    expect(response.status).toBe(409);
  });
});

describe("GET /api/schedules/[id]/overrides", () => {
  it("returns date overrides for schedule", async () => {
    const override = {
      id: "override-1",
      scheduleId: "schedule-id-1",
      date: new Date("2026-03-15"),
      isUnavailable: true,
      startTime: null,
      endTime: null,
    };
    mockPrismaClient.schedule.findUnique.mockResolvedValue({ id: "schedule-id-1", userId: "demo-user-id" });
    mockPrismaClient.dateOverride.findMany.mockResolvedValue([override]);

    const response = await getOverrides(makeRequest(), makeContext());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toHaveLength(1);
  });
});

describe("POST /api/schedules/[id]/overrides", () => {
  it("creates date override for future date", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const futureDateStr = futureDate.toISOString().slice(0, 10);

    mockPrismaClient.schedule.findUnique.mockResolvedValue({ id: "schedule-id-1", userId: "demo-user-id" });
    mockPrismaClient.dateOverride.findFirst.mockResolvedValue(null);
    mockPrismaClient.dateOverride.create.mockResolvedValue({
      id: "override-1",
      scheduleId: "schedule-id-1",
      date: new Date(futureDateStr),
      isUnavailable: true,
      startTime: null,
      endTime: null,
    });

    const request = makeRequest({ date: futureDateStr, isUnavailable: true });
    const response = await postOverride(request, makeContext());
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("returns 400 for past dates", async () => {
    mockPrismaClient.schedule.findUnique.mockResolvedValue({ id: "schedule-id-1", userId: "demo-user-id" });

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const pastDateStr = pastDate.toISOString().slice(0, 10);

    const request = makeRequest({ date: pastDateStr, isUnavailable: true });
    const response = await postOverride(request, makeContext());

    expect(response.status).toBe(400);
  });

  it("returns 409 for duplicate date override", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const futureDateStr = futureDate.toISOString().slice(0, 10);

    mockPrismaClient.schedule.findUnique.mockResolvedValue({ id: "schedule-id-1", userId: "demo-user-id" });
    mockPrismaClient.dateOverride.findFirst.mockResolvedValue({ id: "existing-override" });

    const request = makeRequest({ date: futureDateStr, isUnavailable: true });
    const response = await postOverride(request, makeContext());

    expect(response.status).toBe(409);
  });
});

describe("DELETE /api/schedules/[id]/overrides/[overrideId]", () => {
  it("deletes date override owned by user", async () => {
    mockPrismaClient.dateOverride.findUnique.mockResolvedValue({
      id: "override-1",
      scheduleId: "schedule-id-1",
      schedule: { userId: "demo-user-id" },
    });
    mockPrismaClient.dateOverride.delete.mockResolvedValue({ id: "override-1" });

    const response = await deleteOverride(
      makeRequest(),
      makeContext({ id: "schedule-id-1", overrideId: "override-1" })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 404 when override not found", async () => {
    mockPrismaClient.dateOverride.findUnique.mockResolvedValue(null);

    const response = await deleteOverride(
      makeRequest(),
      makeContext({ id: "schedule-id-1", overrideId: "nonexistent" })
    );
    expect(response.status).toBe(404);
  });
});
