import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityEditor } from "@/components/availability/availability-editor";
import type { ScheduleWithRelations } from "@/types";

export default async function AvailabilityPage() {
  const session = await auth();
  // Layout handles redirect if no session
  const userId = session!.user.id;

  const schedules = await prisma.schedule.findMany({
    where: { userId },
    include: {
      availability: true,
      dateOverrides: {
        orderBy: { date: "asc" },
      },
      _count: {
        select: { eventTypes: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AvailabilityEditor
      initialSchedules={schedules as ScheduleWithRelations[]}
      userTimezone={session!.user.timezone}
    />
  );
}
