import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      timezone: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    timezone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    timezone: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with Zod
          const { email, password } = loginSchema.parse(credentials);

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
              timezone: true,
              passwordHash: true,
              avatarUrl: true,
            },
          });

          // User not found
          if (!user) {
            return null;
          }

          // No password set (OAuth-only account)
          if (!user.passwordHash) {
            return null;
          }

          // Verify password
          const isValidPassword = await compare(password, user.passwordHash);
          if (!isValidPassword) {
            return null;
          }

          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            timezone: user.timezone,
            image: user.avatarUrl,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking if email matches
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // Initial sign in - populate token with user data
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.timezone = user.timezone;
      }

      // Session update - sync token with updated session data
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.username = session.username;
        token.timezone = session.timezone;
      }

      return token;
    },
    session({ session, token }) {
      // Populate session with token data
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.timezone = token.timezone;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth providers, ensure username is set
      if (account?.provider !== "credentials" && user.email) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { username: true },
        });

        // If username not set, generate one from email
        if (existingUser && !existingUser.username) {
          const baseUsername = user.email.split("@")[0].toLowerCase();
          const username = baseUsername.replace(/[^a-z0-9_-]/g, "");

          // Update user with generated username
          await prisma.user.update({
            where: { email: user.email },
            data: { username },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/getting-started",
    error: "/login",
  },
  events: {
    async createUser({ user }) {
      // Create default schedule for new users
      const defaultSchedule = await prisma.schedule.create({
        data: {
          name: "Business Hours",
          timezone: user.timezone || "America/New_York",
          isDefault: true,
          userId: user.id,
          availability: {
            create: [
              // Monday - Friday: 9 AM - 5 PM
              { day: 1, startTime: "09:00", endTime: "17:00" },
              { day: 2, startTime: "09:00", endTime: "17:00" },
              { day: 3, startTime: "09:00", endTime: "17:00" },
              { day: 4, startTime: "09:00", endTime: "17:00" },
              { day: 5, startTime: "09:00", endTime: "17:00" },
            ],
          },
        },
      });

      // Create default event types
      await prisma.eventType.createMany({
        data: [
          {
            title: "30 Minute Meeting",
            slug: "30min",
            duration: 30,
            userId: user.id,
            scheduleId: defaultSchedule.id,
          },
          {
            title: "60 Minute Consultation",
            slug: "60min",
            duration: 60,
            userId: user.id,
            scheduleId: defaultSchedule.id,
          },
        ],
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
});
