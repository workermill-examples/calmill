import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const session = await auth();
  // Layout handles redirect if no session
  const userId = session!.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      avatarUrl: true,
      bio: true,
      timezone: true,
      weekStart: true,
      theme: true,
      passwordHash: true,
      accounts: {
        select: { provider: true },
      },
      schedules: {
        where: { isDefault: true },
        select: { id: true, name: true },
        take: 1,
      },
    },
  });

  if (!dbUser) {
    return <div>User not found</div>;
  }

  const { passwordHash, ...userWithoutHash } = dbUser;

  return (
    <SettingsClient
      user={{
        ...userWithoutHash,
        hasPassword: !!passwordHash,
        defaultSchedule: dbUser.schedules[0] ?? null,
      }}
      appUrl={process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}
    />
  );
}
