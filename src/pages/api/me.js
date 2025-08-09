import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getUsersCollection } from "../../lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.discordId) return res.status(401).end("Unauthorized");

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: session.user.discordId });
  if (!user) return res.status(200).json({
    discordId: session.user.discordId,
    premium: false,
    status: null,
    plan: null,
    planDuration: "free",
  });

  const priceMatrix = {
    supporter: {
      monthly: process.env.STRIPE_PRICE_SUPPORTER_MONTHLY,
      yearly: process.env.STRIPE_PRICE_SUPPORTER_YEARLY,
    },
    sponsor: {
      monthly: process.env.STRIPE_PRICE_SPONSOR_MONTHLY,
      yearly: process.env.STRIPE_PRICE_SPONSOR_YEARLY,
    },
    vip: {
      monthly: process.env.STRIPE_PRICE_VIP_MONTHLY,
      yearly: process.env.STRIPE_PRICE_VIP_YEARLY,
    },
  };

  let planDuration = "free";
  let planTier = null;
  if (user?.plan && user.premium) {
    for (const [tier, durations] of Object.entries(priceMatrix)) {
      if (durations.monthly && user.plan === durations.monthly) {
        planDuration = "monthly";
        planTier = tier;
        break;
      }
      if (durations.yearly && user.plan === durations.yearly) {
        planDuration = "yearly";
        planTier = tier;
        break;
      }
    }
    if (!planTier) planDuration = "pro";
  }

  return res.status(200).json({
    discordId: user.discordId,
    premium: Boolean(user.premium),
    status: user.status || null,
    plan: user.plan || null,
    planDuration,
    planTier,
    currentPeriodEnd: user.currentPeriodEnd || null,
  });
}


