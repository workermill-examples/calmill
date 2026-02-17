import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ─── AUTH HELPERS ────────────────────────────────────────────

/**
 * Gets the authenticated user from the current session.
 * Returns either the user object or an error NextResponse.
 */
export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user: session.user };
}

/**
 * Verifies that the authenticated user owns the resource.
 * Returns a 403 NextResponse if they don't, or null if ownership is confirmed.
 */
export async function verifyOwnership(
  userId: string,
  resourceUserId: string
): Promise<NextResponse | null> {
  if (userId !== resourceUserId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

// ─── HOF WRAPPER ─────────────────────────────────────────────

type AuthenticatedUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  username: string;
  timezone: string;
};

type AuthenticatedHandler = (
  request: Request,
  context: { params: Promise<Record<string, string>> },
  user: AuthenticatedUser
) => Promise<NextResponse>;

/**
 * Higher-order function that wraps a route handler with authentication.
 * The wrapped handler receives the authenticated user as the third argument.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: Request,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const result = await getAuthenticatedUser();
    if (result.error) {
      return result.error;
    }
    return handler(request, context, result.user as AuthenticatedUser);
  };
}
