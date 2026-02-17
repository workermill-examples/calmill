import { Resend } from "resend";
import type { ReactElement } from "react";

// ─── SEND EMAIL ──────────────────────────────────────────────────────────────

export type SendEmailParams = {
  to: string;
  subject: string;
  template: ReactElement;
};

/**
 * Sends a transactional email using Resend.
 *
 * Gracefully skips sending if RESEND_API_KEY is not configured
 * (useful for local development without an email service).
 *
 * Email send errors are caught and logged — they will NOT throw,
 * so a failed email never crashes the calling request.
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const { to, subject, template } = params;

  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email] Skipping send to ${to}: No RESEND_API_KEY configured`);
    return;
  }

  const from =
    process.env.EMAIL_FROM ?? "CalMill <noreply@calmill.workermill.com>";

  try {
    const client = new Resend(process.env.RESEND_API_KEY!);
    const result = await client.emails.send({
      from,
      to,
      subject,
      react: template,
    });

    if (result.error) {
      console.error(
        `[Email] Failed to send to ${to}: ${result.error.message}`,
        result.error
      );
    } else {
      console.log(`[Email] Sent to ${to} (id: ${result.data?.id})`);
    }
  } catch (error) {
    console.error(`[Email] Unexpected error sending to ${to}:`, error);
  }
}
