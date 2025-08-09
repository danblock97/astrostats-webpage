import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { stripe } from "../../../lib/stripe";
import { getUsersCollection } from "../../../lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.discordId) return res.status(401).end("Unauthorized");

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: session.user.discordId });
  if (!user?.stripeCustomerId) return res.status(400).end("No Stripe customer");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/account`,
  });

  return res.status(200).json({ url: portal.url });
}


