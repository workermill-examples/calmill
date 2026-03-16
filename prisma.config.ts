// Prisma 7 configuration for Neon PostgreSQL
// Connection URLs moved out of schema.prisma as required by Prisma 7

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
