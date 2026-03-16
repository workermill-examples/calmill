// Schedules API Tests
// Test the schedules and availability CRUD operations

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    schedule: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn()
    },
    availability: {
      deleteMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    },
    dateOverride: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn()
    },
    $transaction: vi.fn()
  }
}))

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GET as getSchedules, POST as createSchedule } from '@/app/api/schedules/route'
import { GET as getSchedule, PUT as updateSchedule, DELETE as deleteSchedule } from '@/app/api/schedules/[id]/route'
import { GET as getOverrides, POST as createOverride } from '@/app/api/schedules/[id]/overrides/route'
import { DELETE as deleteOverride } from '@/app/api/schedules/[id]/overrides/[overrideId]/route'

const mockAuth = auth as any
const mockPrisma = prisma as any

describe('Schedules API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/schedules', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules')
      const response = await getSchedules(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should return user schedules with related data', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findMany.mockResolvedValue([
        {
          id: 'sched1',
          name: 'Business Hours',
          timezone: 'America/New_York',
          isDefault: true,
          availabilities: [
            { day: 1, startTime: '09:00', endTime: '17:00' }
          ],
          dateOverrides: [],
          _count: { eventTypes: 2 }
        },
        {
          id: 'sched2',
          name: 'Extended Hours',
          timezone: 'America/New_York',
          isDefault: false,
          availabilities: [
            { day: 1, startTime: '08:00', endTime: '20:00' }
          ],
          dateOverrides: [],
          _count: { eventTypes: 0 }
        }
      ])

      const request = new NextRequest('http://localhost:3000/api/schedules')
      const response = await getSchedules(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.schedules).toHaveLength(2)
      expect(data.schedules[0].name).toBe('Business Hours')
      expect(data.schedules[0].eventTypeCount).toBe(2)
      expect(data.schedules[1].eventTypeCount).toBe(0)
      expect(mockPrisma.schedule.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        include: expect.any(Object),
        orderBy: expect.any(Array)
      })
    })
  })

  describe('POST /api/schedules', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Schedule', timezone: 'UTC' })
      })
      const response = await createSchedule(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should create a new schedule', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.create.mockResolvedValue({
        id: 'sched1',
        name: 'Test Schedule',
        timezone: 'UTC',
        isDefault: false,
        availabilities: [],
        dateOverrides: [],
        _count: { eventTypes: 0 }
      })

      const requestData = {
        name: 'Test Schedule',
        timezone: 'UTC',
        isDefault: false
      }

      const request = new NextRequest('http://localhost:3000/api/schedules', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createSchedule(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.schedule.name).toBe('Test Schedule')
      expect(data.schedule.eventTypeCount).toBe(0)
      expect(mockPrisma.schedule.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Schedule',
          timezone: 'UTC',
          isDefault: false,
          userId: 'user1'
        }),
        include: expect.any(Object)
      })
    })

    it('should update existing default when creating new default schedule', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.schedule.create.mockResolvedValue({
        id: 'sched1',
        name: 'New Default',
        timezone: 'UTC',
        isDefault: true,
        availabilities: [],
        dateOverrides: [],
        _count: { eventTypes: 0 }
      })

      const requestData = {
        name: 'New Default',
        timezone: 'UTC',
        isDefault: true
      }

      const request = new NextRequest('http://localhost:3000/api/schedules', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createSchedule(request)

      expect(response.status).toBe(201)
      expect(mockPrisma.schedule.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user1', isDefault: true },
        data: { isDefault: false }
      })
    })

    it('should validate input data', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })

      const requestData = {
        name: '',
        timezone: ''
      }

      const request = new NextRequest('http://localhost:3000/api/schedules', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createSchedule(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('validation_error')
      expect(data.details).toBeDefined()
    })
  })

  describe('GET /api/schedules/[id]', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1')
      const response = await getSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should return schedule details', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        name: 'Business Hours',
        timezone: 'America/New_York',
        isDefault: true,
        availabilities: [
          { day: 1, startTime: '09:00', endTime: '17:00' }
        ],
        dateOverrides: [],
        _count: { eventTypes: 2 }
      })

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1')
      const response = await getSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.schedule.name).toBe('Business Hours')
      expect(data.schedule.eventTypeCount).toBe(2)
    })

    it('should return 404 for non-existent schedule', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/nonexistent')
      const response = await getSchedule(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('not_found')
    })
  })

  describe('PUT /api/schedules/[id]', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Schedule' })
      })
      const response = await updateSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should update schedule without availabilities', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        name: 'Old Name',
        userId: 'user1'
      })
      mockPrisma.$transaction.mockImplementation(async (callback: (prisma: any) => Promise<any>) => {
        return await callback(mockPrisma)
      })
      mockPrisma.schedule.update.mockResolvedValue({
        id: 'sched1',
        name: 'Updated Schedule',
        timezone: 'UTC'
      })
      mockPrisma.schedule.findFirst
        .mockResolvedValueOnce({
          id: 'sched1',
          name: 'Old Name',
          userId: 'user1'
        })
        .mockResolvedValueOnce({
          id: 'sched1',
          name: 'Updated Schedule',
          timezone: 'UTC',
          availabilities: [],
          dateOverrides: [],
          _count: { eventTypes: 1 }
        })

      const requestData = {
        name: 'Updated Schedule',
        timezone: 'UTC'
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', {
        method: 'PUT',
        body: JSON.stringify(requestData)
      })
      const response = await updateSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.schedule.name).toBe('Updated Schedule')
    })

    it('should validate time ranges in availabilities', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })

      const requestData = {
        availabilities: [
          { day: 1, startTime: '17:00', endTime: '09:00' } // Invalid: end before start
        ]
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', {
        method: 'PUT',
        body: JSON.stringify(requestData)
      })
      const response = await updateSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('validation_error')
      expect(data.message).toContain('Start time must be before end time')
    })
  })

  describe('DELETE /api/schedules/[id]', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', { method: 'DELETE' })
      const response = await deleteSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should delete schedule without event types', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        name: 'Test Schedule',
        isDefault: false,
        _count: { eventTypes: 0 }
      })
      mockPrisma.schedule.delete.mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', { method: 'DELETE' })
      const response = await deleteSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('deleted successfully')
      expect(mockPrisma.schedule.delete).toHaveBeenCalledWith({ where: { id: 'sched1' } })
    })

    it('should prevent deletion with active event types', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        name: 'Test Schedule',
        isDefault: false,
        _count: { eventTypes: 2 }
      })

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', { method: 'DELETE' })
      const response = await deleteSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('conflict')
      expect(data.message).toContain('used by event types')
    })

    it('should prevent deletion of the only schedule', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        name: 'Test Schedule',
        isDefault: true,
        _count: { eventTypes: 0 }
      })
      mockPrisma.schedule.count.mockResolvedValue(1)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1', { method: 'DELETE' })
      const response = await deleteSchedule(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('conflict')
      expect(data.message).toContain('only schedule')
    })
  })

  describe('GET /api/schedules/[id]/overrides', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides')
      const response = await getOverrides(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should return date overrides for schedule', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findMany.mockResolvedValue([
        {
          id: 'override1',
          date: new Date('2024-12-25'),
          startTime: null,
          endTime: null,
          isUnavailable: true,
          scheduleId: 'sched1'
        },
        {
          id: 'override2',
          date: new Date('2024-12-31'),
          startTime: '10:00',
          endTime: '14:00',
          isUnavailable: false,
          scheduleId: 'sched1'
        }
      ])

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides')
      const response = await getOverrides(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.overrides).toHaveLength(2)
      expect(data.overrides[0].isUnavailable).toBe(true)
      expect(data.overrides[1].isUnavailable).toBe(false)
    })

    it('should filter by date range when provided', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findMany.mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides?startDate=2024-12-01&endDate=2024-12-31')
      const response = await getOverrides(request, { params: Promise.resolve({ id: 'sched1' }) })

      expect(response.status).toBe(200)
      expect(mockPrisma.dateOverride.findMany).toHaveBeenCalledWith({
        where: {
          scheduleId: 'sched1',
          date: {
            gte: new Date('2024-12-01'),
            lte: new Date('2024-12-31')
          }
        },
        orderBy: { date: 'asc' }
      })
    })
  })

  describe('POST /api/schedules/[id]/overrides', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides', {
        method: 'POST',
        body: JSON.stringify({ date: '2024-12-25', isUnavailable: true })
      })
      const response = await createOverride(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should create unavailable date override', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findFirst.mockResolvedValue(null)
      mockPrisma.dateOverride.create.mockResolvedValue({
        id: 'override1',
        date: new Date('2024-12-25'),
        startTime: null,
        endTime: null,
        isUnavailable: true,
        scheduleId: 'sched1'
      })

      const requestData = {
        date: '2024-12-25',
        isUnavailable: true
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createOverride(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.override.isUnavailable).toBe(true)
      expect(data.override.startTime).toBeNull()
      expect(data.override.endTime).toBeNull()
    })

    it('should create available date override with times', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findFirst.mockResolvedValue(null)
      mockPrisma.dateOverride.create.mockResolvedValue({
        id: 'override2',
        date: new Date('2024-12-31'),
        startTime: '10:00',
        endTime: '14:00',
        isUnavailable: false,
        scheduleId: 'sched1'
      })

      const requestData = {
        date: '2024-12-31',
        startTime: '10:00',
        endTime: '14:00',
        isUnavailable: false
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createOverride(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.override.isUnavailable).toBe(false)
      expect(data.override.startTime).toBe('10:00')
      expect(data.override.endTime).toBe('14:00')
    })

    it('should reject duplicate date overrides', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findFirst.mockResolvedValue({
        id: 'existing',
        date: new Date('2024-12-25')
      })

      const requestData = {
        date: '2024-12-25',
        isUnavailable: true
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createOverride(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('conflict')
    })

    it('should reject past dates', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.schedule.findFirst.mockResolvedValue({
        id: 'sched1',
        userId: 'user1'
      })
      mockPrisma.dateOverride.findFirst.mockResolvedValue(null)

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const pastDate = yesterday.toISOString().split('T')[0]

      const requestData = {
        date: pastDate,
        isUnavailable: true
      }

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides', {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const response = await createOverride(request, { params: Promise.resolve({ id: 'sched1' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('validation_error')
      expect(data.message).toContain('past dates')
    })
  })

  describe('DELETE /api/schedules/[id]/overrides/[overrideId]', () => {
    it('should require authentication', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides/override1', { method: 'DELETE' })
      const response = await deleteOverride(request, {
        params: Promise.resolve({ id: 'sched1', overrideId: 'override1' })
      })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('unauthorized')
    })

    it('should delete date override', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.dateOverride.findFirst.mockResolvedValue({
        id: 'override1',
        scheduleId: 'sched1',
        schedule: { userId: 'user1' }
      })
      mockPrisma.dateOverride.delete.mockResolvedValue({})

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides/override1', { method: 'DELETE' })
      const response = await deleteOverride(request, {
        params: Promise.resolve({ id: 'sched1', overrideId: 'override1' })
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('deleted successfully')
      expect(mockPrisma.dateOverride.delete).toHaveBeenCalledWith({ where: { id: 'override1' } })
    })

    it('should return 404 for non-existent override', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.dateOverride.findFirst.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides/nonexistent', { method: 'DELETE' })
      const response = await deleteOverride(request, {
        params: Promise.resolve({ id: 'sched1', overrideId: 'nonexistent' })
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('not_found')
    })

    it('should return 403 for unauthorized access', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })
      mockPrisma.dateOverride.findFirst.mockResolvedValue({
        id: 'override1',
        scheduleId: 'sched1',
        schedule: { userId: 'other_user' }
      })

      const request = new NextRequest('http://localhost:3000/api/schedules/sched1/overrides/override1', { method: 'DELETE' })
      const response = await deleteOverride(request, {
        params: Promise.resolve({ id: 'sched1', overrideId: 'override1' })
      })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('forbidden')
    })
  })
})