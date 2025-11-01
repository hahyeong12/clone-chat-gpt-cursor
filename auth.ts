import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { User } from "next-auth";
import { JWT } from "next-auth/jwt";

// 사용자 프로필 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    idToken?: string;
  }
  
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google 로그인 성공 시 사용자 정보 저장
      if (account?.provider === "google" && user.email) {
        // 사용자 프로필을 저장소에 저장
        await saveUserProfile({
          userId: user.email, // email을 userId로 사용
          email: user.email,
          name: user.name || (profile as any)?.name || "사용자",
          image: user.image || (profile as any)?.picture || undefined,
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || token.sub || token.email || "";
      }
      session.idToken = token.idToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.email || user.id;
      }
      if (account) {
        token.idToken = account.id_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});

// 사용자 프로필 저장 함수
async function saveUserProfile(userData: {
  userId: string;
  email: string;
  name: string;
  image?: string;
}) {
  // user-profile.ts의 함수를 사용
  const { getOrCreateGoogleUser } = await import("@/lib/user-profile");
  
  getOrCreateGoogleUser(userData.userId, userData.email, userData.name);
}

