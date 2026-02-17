import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, verifyOwnership } from "@/lib/api-auth";

// DELETE /api/schedules/[id]/overrides/[overrideId] — Delete a date override
export const DELETE = withAuth(async (_request, context, user) => {
  try {
    const { id, overrideId } = await context.params;

    // Verify the schedule exists and the user owns it
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    const ownershipError = await verifyOwnership(user.id, schedule.userId);
    if (ownershipError) return ownershipError;

    // Verify the override exists and belongs to this schedule
    const override = await prisma.dateOverride.findUnique({
      where: { id: overrideId },
      select: { id: true, scheduleId: true },
    });

    if (!override || override.scheduleId !== id) {
      return NextResponse.json({ error: "Date override not found" }, { status: 404 });
    }

    await prisma.dateOverride.delete({ where: { id: overrideId } });

    return NextResponse.json({ success: true, message: "Date override deleted" });
  } catch (error) {
    console.error("DELETE /api/schedules/[id]/overrides/[overrideId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
