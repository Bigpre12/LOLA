import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "LOLA <noreply@lola.ai>",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch additional user data
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { plan: true, credits: true, preferences: true },
        });
        if (dbUser) {
          session.user.plan = dbUser.plan;
          session.user.credits = dbUser.credits;
          session.user.preferences = dbUser.preferences as Record<string, unknown> | null;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async createUser({ user }) {
      // Initialize new user with default credits
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: 100,
          plan: "FREE",
          preferences: {
            onboardingCompleted: false,
          },
        },
      });
    },
  },
});

// Type extensions for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan?: string;
      credits?: number;
      preferences?: Record<string, unknown> | null;
    };
  }
}
