// PrismaClient singleton with PrismaNeon adapter for Prisma 7
// Import from the generated client location as required by Prisma 7

import { PrismaClient, Prisma } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

// Singleton pattern for PrismaClient
declare global {
  var cachedPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

// Configure Neon for WebSocket usage
neonConfig.webSocketConstructor = (
  url: string,
  protocols: string | string[] | undefined,
) => {
  // In Node.js environment, use ws
  if (typeof WebSocket === "undefined") {
    const WebSocket = require("ws");
    return new WebSocket(url, protocols);
  }
  return new WebSocket(url, protocols);
};

if (process.env.NODE_ENV === "production") {
  // In production, create a new instance with Neon adapter
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaNeon({ connectionString });

  prisma = new PrismaClient({
    adapter,
    log: ["error"],
  });
} else {
  // In development, use singleton pattern to avoid multiple instances
  if (!global.cachedPrisma) {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });

    global.cachedPrisma = new PrismaClient({
      adapter,
      log: ["query", "error"],
    });
  }

  prisma = global.cachedPrisma;
}

export { prisma };
export default prisma;
