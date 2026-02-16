import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials using Zod schema
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify password
          const isValidPassword = await bcryptjs.compare(password, user.passwordHash);

          if (!isValidPassword) {
            return null;
          }

          // Return user object without sensitive data
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            timezone: user.timezone,
            image: user.avatarUrl,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.timezone = user.timezone;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.timezone = token.timezone as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Generate username from email if user doesn't exist
            const emailPrefix = user.email!.split("@")[0];
            let username = emailPrefix.toLowerCase().replace(/[^a-z0-9_-]/g, "");

            // Ensure username is unique
            let counter = 0;
            let finalUsername = username;
            while (true) {
              const existingUsername = await prisma.user.findUnique({
                where: { username: finalUsername },
              });
              if (!existingUsername) break;
              counter++;
              finalUsername = `${username}${counter}`;
            }

            // Update the user object with the generated username
            user.username = finalUsername;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/getting-started",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        // Create default schedule for new Google users
        try {
          await prisma.schedule.create({
            data: {
              name: "Business Hours",
              isDefault: true,
              timezone: "America/New_York",
              userId: user.id!,
              availability: {
                create: [
                  { day: 1, startTime: "09:00", endTime: "17:00" }, // Monday
                  { day: 2, startTime: "09:00", endTime: "17:00" }, // Tuesday
                  { day: 3, startTime: "09:00", endTime: "17:00" }, // Wednesday
                  { day: 4, startTime: "09:00", endTime: "17:00" }, // Thursday
                  { day: 5, startTime: "09:00", endTime: "17:00" }, // Friday
                ],
              },
            },
          });
        } catch (error) {
          console.error("Failed to create default schedule:", error);
        }
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
});