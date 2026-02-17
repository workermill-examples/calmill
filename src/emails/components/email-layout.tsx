import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

// Brand colors from CalMill design system
export const colors = {
  primary: "#2563eb",
  primaryLight: "#eff6ff",
  success: "#22c55e",
  successLight: "#f0fdf4",
  danger: "#ef4444",
  dangerLight: "#fef2f2",
  warning: "#f59e0b",
  warningLight: "#fffbeb",
  text: "#111827",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  background: "#f9fafb",
  white: "#ffffff",
} as const;

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        {/* Header */}
        <Section style={styles.header}>
          <Link href={process.env.NEXT_PUBLIC_APP_URL ?? "https://calmill.workermill.com"} style={styles.logoLink}>
            <Text style={styles.logoText}>CalMill</Text>
          </Link>
        </Section>

        {/* Card */}
        <Container style={styles.card}>
          {children}
        </Container>

        {/* Footer */}
        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by{" "}
            <Link
              href={process.env.NEXT_PUBLIC_APP_URL ?? "https://calmill.workermill.com"}
              style={styles.footerLink}
            >
              CalMill
            </Link>
          </Text>
          <Text style={styles.footerSubtext}>
            You are receiving this email because a booking was made through CalMill.
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: colors.background,
    fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    margin: "0",
    padding: "0",
  },
  header: {
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    padding: "16px 24px",
    textAlign: "center" as const,
  },
  logoLink: {
    textDecoration: "none",
  },
  logoText: {
    color: colors.primary,
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: "0",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    margin: "24px auto",
    maxWidth: "560px",
    padding: "40px 48px",
  },
  footer: {
    margin: "0 auto",
    maxWidth: "560px",
    padding: "0 24px 32px",
    textAlign: "center" as const,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 4px",
  },
  footerLink: {
    color: colors.primary,
    textDecoration: "none",
  },
  footerSubtext: {
    color: colors.textMuted,
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0",
  },
} as const;
