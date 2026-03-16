// Unit tests for signup API route
// Tests user registration with bcryptjs and Zod validation

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/signup/route'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
}))

import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validSignupData = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    name: 'Test User',
    timezone: 'America/New_York',
  }

  it('creates a new user successfully', async () => {
    // Mock Prisma responses
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null) // No existing user
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'test-id',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      timezone: 'America/New_York',
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash: 'hashed-password',
      image: null,
      weekStart: 0,
      bio: null,
      theme: 'light',
    })

    // Mock bcryptjs
    vi.mocked(bcryptjs.hash).mockResolvedValue('hashed-password' as any)

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(validSignupData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('User created successfully')
    expect(data.user).toMatchObject({
      id: 'test-id',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      timezone: 'America/New_York',
    })
    expect(data.user.createdAt).toBeDefined()

    expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 12)
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(2) // Check email and username
    expect(prisma.user.create).toHaveBeenCalled()
  })

  it('returns 400 when user with email already exists', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({
      id: 'existing-id',
      email: 'test@example.com',
      username: 'existinguser',
      name: 'Existing User',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash: 'existing-hash',
      image: null,
      weekStart: 0,
      bio: null,
      theme: 'light',
    })

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(validSignupData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('user_exists')
    expect(data.message).toBe('A user with this email already exists')
  })

  it('returns 400 when username is taken', async () => {
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce(null) // Email check passes
      .mockResolvedValueOnce({     // Username check fails
        id: 'existing-id',
        email: 'other@example.com',
        username: 'testuser',
        name: 'Other User',
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordHash: 'existing-hash',
        image: null,
        weekStart: 0,
        bio: null,
        theme: 'light',
      })

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(validSignupData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('username_taken')
    expect(data.message).toBe('This username is already taken')
  })

  it('returns 400 for invalid email', async () => {
    const invalidData = {
      ...validSignupData,
      email: 'invalid-email',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('validation_error')
    expect(data.message).toBe('Invalid input data')
    expect(data.details).toHaveLength(1)
    expect(data.details[0]).toMatchObject({
      message: 'Invalid email address',
      path: ['email'],
    })
  })

  it('returns 400 for short password', async () => {
    const invalidData = {
      ...validSignupData,
      password: '123',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('validation_error')
    expect(data.details[0].message).toBe('Password must be at least 8 characters')
  })

  it('returns 400 for invalid username characters', async () => {
    const invalidData = {
      ...validSignupData,
      username: 'test@user',
    }

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('validation_error')
    expect(data.details[0].message).toBe('Username can only contain letters, numbers, hyphens, and underscores')
  })

  it('returns 500 for database error', async () => {
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(validSignupData),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('internal_error')
    expect(data.message).toBe('Internal server error')
  })

  it('defaults timezone to UTC when not provided', async () => {
    const dataWithoutTimezone = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      name: 'Test User',
    }

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'test-id',
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash: 'hashed-password',
      image: null,
      weekStart: 0,
      bio: null,
      theme: 'light',
    })
    vi.mocked(bcryptjs.hash).mockResolvedValue('hashed-password' as any)

    const request = new NextRequest('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(dataWithoutTimezone),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user.timezone).toBe('UTC')
  })
})