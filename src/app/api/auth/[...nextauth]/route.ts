// NextAuth v5 API route handler
// Handles all NextAuth authentication routes with Promise params for Next.js 16

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers