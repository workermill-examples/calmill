import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EmbedCodeGeneratorClient } from './embed-code-generator-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;
  const username = session!.user.username;

  const eventType = await prisma.eventType.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      duration: true,
      userId: true,
    },
  });

  if (!eventType) notFound();
  if (eventType.userId !== userId) redirect('/event-types');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return <EmbedCodeGeneratorClient eventType={eventType} username={username} appUrl={appUrl} />;
}
