import NextAuth, { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "public_repo,read:user",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, profile, account }) {
      if (!profile || !account || !user) {
        return false;
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        // @ts-expect-error unknown-type
        token.userName = profile.login;
      }
      return token;
    },
    async session({ session, token, user }) {
      // @ts-expect-error unknown-type
      session.accessToken = token.accessToken as string;
      // @ts-expect-error unknown-type
      session.userName = token.userName;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
