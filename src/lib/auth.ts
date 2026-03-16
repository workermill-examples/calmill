// NextAuth v5 configuration
// JWT strategy with credentials provider and bcryptjs password hashing

import NextAuth, { DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          // Verify password with bcryptjs
          const isValidPassword = await bcryptjs.compare(
            password,
            user.passwordHash,
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            timezone: user.timezone,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Populate token with user data on sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.timezone = user.timezone;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass user data from token to session
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.timezone = token.timezone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
