import { handlers } from "@/lib/auth";

/**
 * NextAuth v5 Route Handler
 * Exports GET and POST handlers from the auth configuration
 */
export const { GET, POST } = handlers;
