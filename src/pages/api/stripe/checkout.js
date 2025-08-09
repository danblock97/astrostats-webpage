import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { stripe } from "../../../lib/stripe";
import { getUsersCollection } from "../../../lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.discordId) return res.status(401).end("Unauthorized");

  const { plan, priceId: directPriceId, tier, duration } = req.body || {};
  let priceId = directPriceId;
  // Back-compat: "plan" was previously "monthly" | "yearly" for the single tier
  const billingKey = duration || plan; // prefer duration if provided
  const tierKey = (tier || "sponsor").toLowerCase(); // default to middle tier
  if (!priceId && billingKey) {
    const matrix = {
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
    priceId = matrix[tierKey]?.[billingKey];
  }
  if (!priceId) return res.status(400).end("Missing plan/priceId");

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: session.user.discordId });
  let customerId = user?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { discordId: session.user.discordId },
    });
    customerId = customer.id;
    await users.updateOne(
      { discordId: session.user.discordId },
      { $set: { stripeCustomerId: customerId, updatedAt: new Date() } }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    success_url: `${appUrl}/account?success=1`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    metadata: { discordId: session.user.discordId },
  });

  return res.status(200).json({ url: checkout.url });
}


