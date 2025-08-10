export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function createHandler() {
  const NextAuthMod = await import("next-auth");
  const NextAuth = NextAuthMod.default ?? NextAuthMod;
  const DiscordMod = await import("next-auth/providers/discord");
  const DiscordProvider = DiscordMod.default ?? DiscordMod;

  const authOptions = {
    trustHost: true,
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        authorization: { url: "https://discord.com/api/oauth2/authorize", params: { scope: "identify" } },
        token: "https://discord.com/api/oauth2/token",
        userinfo: "https://discord.com/api/users/@me",
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
    debug: true,
    logger: {
      error(code, metadata) {
        console.error("[NextAuth][error]", code, metadata);
      },
      warn(code) {
        console.warn("[NextAuth][warn]", code);
      },
      debug(code, metadata) {
        console.log("[NextAuth][debug]", code, metadata);
      },
    },
    session: { strategy: "jwt" },
    pages: { signIn: "/account" },
    callbacks: {
      async jwt({ token, account, profile, user }) {
        // profile is undefined on callback after first sign-in; use user.id when available
        const discordId = profile?.id || user?.id;
        if (account && discordId) token.discordId = discordId;
        return token;
      },
      async session({ session, token }) {
        if (token?.discordId && session?.user) session.user.discordId = token.discordId;
        return session;
      },
      async signIn({ profile }) {
        try {
          if (!profile?.id) return false;
          // Skip DB upsert if MONGODB_URI is not configured; do not block sign-in
          if (process.env.MONGODB_URI) {
            const { getUsersCollection } = await import("../../../../lib/mongo");
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
          }
          return true;
        } catch (err) {
          console.error("signIn upsert failed", err);
          // Allow sign-in even if DB write fails to avoid auth error loop
          return true;
        }
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return NextAuth(authOptions);
}

export async function GET(req, ctx) {
  const handler = await createHandler();
  return handler(req, ctx);
}

export async function POST(req, ctx) {
  const handler = await createHandler();
  return handler(req, ctx);
}


