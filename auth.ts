import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials.password || !credentials.email) {
          return null;
        }
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()));
        if (user.length === 0) return null;
        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password
        );
        if (!isPasswordValid) return null;
        return {
          id: user[0].id.toString(),
          name: user[0].fullName,
          email: user[0].email,
        } as User;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
