import { getToken } from "next-auth/jwt";
import { getUsersCollection } from "../../../lib/mongo";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.discordId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: token.discordId });
  if (!user) {
    return NextResponse.json({
      discordId: token.discordId,
      premium: false,
      status: null,
      plan: null,
      planDuration: "free",
      role: null,
    });
  }

  const priceMatrix = {
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

  const validTiers = ["supporter", "sponsor", "vip"];
  let planDuration = "free";
  let planTier = null;
  let hasStripeSubscription = false;

  if (user?.plan && user.premium) {
    for (const [tier, durations] of Object.entries(priceMatrix)) {
      if (durations.monthly && user.plan === durations.monthly) {
        planDuration = "monthly";
        planTier = tier;
        hasStripeSubscription = true;
        break;
      }
      if (durations.yearly && user.plan === durations.yearly) {
        planDuration = "yearly";
        planTier = tier;
        hasStripeSubscription = true;
        break;
      }
    }
    // If plan didn't match Stripe prices but user has premium, use role as fallback for planTier
    if (!planTier && user.premium) {
      const normalizedRole = (user.role || "").toLowerCase();
      if (validTiers.includes(normalizedRole)) {
        planTier = normalizedRole;
        planDuration = "gifted"; // Indicate this is a manually-granted subscription
      } else {
        planDuration = "pro";
      }
    }
  } else if (user.premium && !user.plan) {
    // User has premium but no plan (manually granted)
    const normalizedRole = (user.role || "").toLowerCase();
    if (validTiers.includes(normalizedRole)) {
      planTier = normalizedRole;
      planDuration = "gifted";
    }
  }

  // Check if user has a Stripe customer ID (for billing portal access)
  const hasStripeCustomer = Boolean(user.stripeCustomerId);

  return NextResponse.json({
    discordId: user.discordId,
    premium: Boolean(user.premium),
    status: user.status || null,
    plan: user.plan || null,
    planDuration,
    planTier,
    role: user.role || planTier || null,
    currentPeriodEnd: user.currentPeriodEnd || null,
    hasStripeSubscription,
    hasStripeCustomer,
  });
}


