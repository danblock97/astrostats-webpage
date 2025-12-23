import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DiscordProvider = require("next-auth/providers/discord").default;

export const authOptions = {
  // Allow NextAuth to trust the host header in production (e.g., on Vercel)
  trustHost: true,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: "identify email" },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : undefined,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/account",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.discordId && session?.user) {
        session.user.discordId = token.discordId;
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        if (!profile?.id) return false;
        // Lazy-load the database module to avoid throwing at import time
        // when environment variables (e.g., MONGODB_URI) are not set for
        // read-only endpoints like /api/auth/session.
        const { getUsersCollection } = await import("../lib/mongo");
        const users = await getUsersCollection();
        await users.updateOne(
          { discordId: profile.id },
          {
            $setOnInsert: {
              createdAt: new Date(),
            },
            $set: {
              discordId: profile.id,
              username: profile.username,
              avatar: profile.avatar,
              email: profile.email,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );
        return true;
      } catch (err) {
        console.error("signIn upsert failed", err);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


