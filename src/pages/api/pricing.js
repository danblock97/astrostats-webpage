import { stripe } from "../../lib/stripe";

/**
 * Returns public pricing information for all tiers using Stripe Price IDs
 * configured in environment variables. This prevents exposing price IDs or
 * amounts in client-side bundles while keeping values source-of-truth in Stripe.
 */
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const priceIds = {
      supporter: {
        monthly: process.env.STRIPE_PRICE_SUPPORTER_MONTHLY || process.env.STRIPE_PRICE_PREMIUM_MONTHLY_SUPPORTER,
        yearly: process.env.STRIPE_PRICE_SUPPORTER_YEARLY || process.env.STRIPE_PRICE_PREMIUM_YEARLY_SUPPORTER,
      },
      sponsor: {
        monthly: process.env.STRIPE_PRICE_SPONSOR_MONTHLY || process.env.STRIPE_PRICE_PREMIUM_MONTHLY_SPONSOR || process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        yearly: process.env.STRIPE_PRICE_SPONSOR_YEARLY || process.env.STRIPE_PRICE_PREMIUM_YEARLY_SPONSOR || process.env.STRIPE_PRICE_PREMIUM_YEARLY,
      },
      vip: {
        monthly: process.env.STRIPE_PRICE_VIP_MONTHLY || process.env.STRIPE_PRICE_PREMIUM_MONTHLY_VIP,
        yearly: process.env.STRIPE_PRICE_VIP_YEARLY || process.env.STRIPE_PRICE_PREMIUM_YEARLY_VIP,
      },
    };

    // Fetch Stripe price objects only for configured IDs
    async function fetchPrice(priceId) {
      if (!priceId) return null;
      const price = await stripe.prices.retrieve(priceId);
      return {
        id: price.id,
        currency: price.currency,
        unit_amount: price.unit_amount,
        recurring: price.recurring || null,
      };
    }

    const [
      supMo,
      supYr,
      spoMo,
      spoYr,
      vipMo,
      vipYr,
    ] = await Promise.all([
      fetchPrice(priceIds.supporter.monthly),
      fetchPrice(priceIds.supporter.yearly),
      fetchPrice(priceIds.sponsor.monthly),
      fetchPrice(priceIds.sponsor.yearly),
      fetchPrice(priceIds.vip.monthly),
      fetchPrice(priceIds.vip.yearly),
    ]);

    const result = {
      currency: (supMo || supYr || spoMo || spoYr || vipMo || vipYr)?.currency || "gbp",
      ids: priceIds,
      tiers: {
        supporter: { monthly: supMo, yearly: supYr },
        sponsor: { monthly: spoMo, yearly: spoYr },
        vip: { monthly: vipMo, yearly: vipYr },
      },
    };

    return res.status(200).json(result);
  } catch (e) {
    console.error("/api/pricing error", e);
    return res.status(500).json({ error: "Failed to load pricing" });
  }
}


