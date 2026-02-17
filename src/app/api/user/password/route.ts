import { NextResponse } from "next/server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/api-auth";
import { changePasswordSchema } from "@/lib/validations";

// PUT /api/user/password — Change authenticated user's password
export const PUT = withAuth(async (request, _context, user) => {
  try {
    const body = await request.json();
    const validated = changePasswordSchema.parse(body);

    // Load user's current password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!dbUser.passwordHash) {
      return NextResponse.json(
        { error: "Account uses social login — no password to change" },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(
      validated.currentPassword,
      dbUser.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hash(validated.newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("PUT /api/user/password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
