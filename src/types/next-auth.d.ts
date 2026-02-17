import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `auth()` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** User's unique ID from the database */
      id: string;
      /** User's unique username (used in public URLs) */
      username: string;
      /** User's IANA timezone (e.g., "America/New_York") */
      timezone: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    /** User's unique username */
    username: string;
    /** User's IANA timezone */
    timezone: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT extends DefaultJWT {
    /** User's unique ID from the database */
    id: string;
    /** User's unique username */
    username: string;
    /** User's IANA timezone */
    timezone: string;
  }
}
