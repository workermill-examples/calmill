import { Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { colors } from "./email-layout";

interface DetailRowProps {
  icon: string;
  label: string;
  children: ReactNode;
}

export function DetailRow({ icon, label, children }: DetailRowProps) {
  return (
    <Section style={styles.row}>
      <Text style={styles.label}>
        <span style={styles.icon}>{icon}</span> {label}
      </Text>
      <Text style={styles.value}>{children}</Text>
    </Section>
  );
}

const styles = {
  row: {
    marginBottom: "12px",
  },
  icon: {
    marginRight: "6px",
  },
  label: {
    color: colors.textMuted,
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    margin: "0 0 2px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: colors.text,
    fontSize: "15px",
    lineHeight: "1.5",
    margin: "0",
  },
} as const;
