// User registration endpoint with bcryptjs password hashing and Zod validation
// Creates new user accounts with proper validation

import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  name: z.string().min(1, 'Name is required'),
  timezone: z.string().default('UTC'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user with email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'user_exists', message: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Check if username is taken
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'username_taken', message: 'This username is already taken' },
        { status: 400 }
      )
    }

    // Hash password with bcryptjs
    const saltRounds = 12
    const passwordHash = await bcryptjs.hash(validatedData.password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        name: validatedData.name,
        passwordHash,
        timezone: validatedData.timezone,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        timezone: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'validation_error',
          message: 'Invalid input data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}