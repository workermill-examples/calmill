import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    // Direct (non-pooled) URL for CLI migrations; falls back for generate-only
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "postgresql://localhost:5432/calmill",
  },
});
