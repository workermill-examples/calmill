import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { sendTestWebhook } from "@/lib/webhooks";

type Params = { params: Promise<{ id: string }> };

// ─── POST /api/webhooks/[id]/test — Send test payload to webhook ──────────────

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;

  const authResult = await getAuthenticatedUser();
  if (authResult.error) return authResult.error;
  const { user } = authResult;

  try {
    const webhook = await prisma.webhook.findUnique({ where: { id } });

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    if (webhook.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await sendTestWebhook({
      url: webhook.url,
      secret: webhook.secret,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/webhooks/[id]/test error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
