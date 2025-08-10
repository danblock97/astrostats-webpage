export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function createHandler() {
  const { default: NextAuth } = await import("next-auth");
  const { default: DiscordProvider } = await import("next-auth/providers/discord");

  const authOptions = {
    trustHost: true,
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
    pages: { signIn: "/account" },
    callbacks: {
      async jwt({ token, account, profile }) {
        if (account && profile) token.discordId = profile.id;
        return token;
      },
      async session({ session, token }) {
        if (token?.discordId && session?.user) session.user.discordId = token.discordId;
        return session;
      },
      async signIn({ profile }) {
        try {
          if (!profile?.id) return false;
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
          return true;
        } catch (err) {
          console.error("signIn upsert failed", err);
          return false;
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


