import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getUsersCollection } from "../../../lib/mongo";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify" } },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : undefined,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.discordId) {
        session.user.discordId = token.discordId;
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        if (!profile?.id) return false;
        const users = await getUsersCollection();
        await users.updateOne(
          { discordId: profile.id },
          {
            $setOnInsert: { createdAt: new Date() },
            $set: {
              discordId: profile.id,
              username: profile.username,
              avatar: profile.avatar,
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

export default NextAuth(authOptions);


