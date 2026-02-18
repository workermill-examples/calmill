import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EventTypeEditor } from '@/components/event-types/editor';
import type { EventTypeLocation, CustomQuestion } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventTypeEditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  // Layout handles redirect if no session
  const userId = session!.user.id;
  const username = session!.user.username;

  const eventType = await prisma.eventType.findUnique({
    where: { id },
    include: {
      schedule: {
        include: {
          availability: true,
          dateOverrides: {
            orderBy: { date: 'asc' },
          },
        },
      },
    },
  });

  if (!eventType) notFound();
  if (eventType.userId !== userId) redirect('/event-types');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return (
    <EventTypeEditor
      eventType={{
        ...eventType,
        locations: (eventType.locations as EventTypeLocation[] | null) ?? null,
        customQuestions: (eventType.customQuestions as CustomQuestion[] | null) ?? null,
      }}
      username={username}
      appUrl={appUrl}
    />
  );
}
