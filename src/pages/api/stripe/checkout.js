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
    const T = tierKey.toUpperCase();
    const D = billingKey.toUpperCase();
    // Primary var names
    const primary = process.env[`STRIPE_PRICE_${T}_${D}`];
    // Alternate naming used in your .env: STRIPE_PRICE_PREMIUM_<DURATION>_<TIER>
    const alt = process.env[`STRIPE_PRICE_PREMIUM_${D}_${T}`];
    // Legacy single-tier fallback for Sponsor only
    const legacy = tierKey === "sponsor" ? process.env[`STRIPE_PRICE_PREMIUM_${D}`] : undefined;
    priceId = primary || alt || legacy;
  }
  if (!priceId) {
    // Backwards compatibility: allow legacy PREMIUM_* envs for the middle tier
    if (tierKey === "sponsor") {
      const legacy = {
        monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
      };
      priceId = legacy[billingKey];
    }
  }

  if (!priceId) {
    return res.status(400).json({
      error: "Missing plan/priceId",
      hint: "Ensure STRIPE_PRICE_<TIER>_<DURATION> env vars are set and restart the dev server.",
      received: { tier: tierKey, duration: billingKey },
      expectedEnv: {
        supporter: ["STRIPE_PRICE_SUPPORTER_MONTHLY", "STRIPE_PRICE_SUPPORTER_YEARLY", "STRIPE_PRICE_PREMIUM_MONTHLY_SUPPORTER", "STRIPE_PRICE_PREMIUM_YEARLY_SUPPORTER"],
        sponsor: ["STRIPE_PRICE_SPONSOR_MONTHLY", "STRIPE_PRICE_SPONSOR_YEARLY", "STRIPE_PRICE_PREMIUM_MONTHLY_SPONSOR", "STRIPE_PRICE_PREMIUM_YEARLY_SPONSOR", "STRIPE_PRICE_PREMIUM_MONTHLY", "STRIPE_PRICE_PREMIUM_YEARLY"],
        vip: ["STRIPE_PRICE_VIP_MONTHLY", "STRIPE_PRICE_VIP_YEARLY", "STRIPE_PRICE_PREMIUM_MONTHLY_VIP", "STRIPE_PRICE_PREMIUM_YEARLY_VIP"],
      },
    });
  }

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


