import { mergeAnonymousCartWithUserCart } from "@/lib/db/cart";
import prisma from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const nextAuthOptions: NextAuthOptions = {
  // PrismaAdapter allow to save user info and session data in mongodb using prisma
  // this works togther very well
  adapter: PrismaAdapter(prisma as PrismaClient),
  // Can add multiple providers
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // it will be trigered whenever we return session from the DB
    // Here we can add what data we want in user object
    session({ session, user }) {
      // This way we can take the user id from DB and add it to the session user oject.
      // But typescript doesn't recognise an id field on this session user
      // So we have to configure this type, we have to extend the user type
      session.user.id = user.id;
      return session;
    },
  },
  //  it will be called every time when certain auth operations happen.
  events: {
    // This will be called right after signin, but before returned to home page
    async signIn({ user }) {
      await mergeAnonymousCartWithUserCart(user.id);
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
