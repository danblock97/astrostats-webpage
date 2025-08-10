import { getToken } from "next-auth/jwt";
import { stripe } from "../../../../lib/stripe";
import { getUsersCollection } from "../../../../lib/mongo";
import { NextResponse } from "next/server";

function deriveTierFromPrice(priceId) {
  if (!priceId) return null;
  const map = {
    supporter: [
      process.env.STRIPE_PRICE_SUPPORTER_MONTHLY,
      process.env.STRIPE_PRICE_SUPPORTER_YEARLY,
      process.env.STRIPE_PRICE_PREMIUM_MONTHLY_SUPPORTER,
      process.env.STRIPE_PRICE_PREMIUM_YEARLY_SUPPORTER,
    ],
    sponsor: [
      process.env.STRIPE_PRICE_SPONSOR_MONTHLY,
      process.env.STRIPE_PRICE_SPONSOR_YEARLY,
      process.env.STRIPE_PRICE_PREMIUM_MONTHLY_SPONSOR,
      process.env.STRIPE_PRICE_PREMIUM_YEARLY_SPONSOR,
      process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
      process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    ],
    vip: [
      process.env.STRIPE_PRICE_VIP_MONTHLY,
      process.env.STRIPE_PRICE_VIP_YEARLY,
      process.env.STRIPE_PRICE_PREMIUM_MONTHLY_VIP,
      process.env.STRIPE_PRICE_PREMIUM_YEARLY_VIP,
    ],
  };
  for (const [tier, ids] of Object.entries(map)) {
    if (ids.filter(Boolean).includes(priceId)) return tier;
  }
  return null;
}

export async function POST(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.discordId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: token.discordId });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer on file" }, { status: 400 });
  }

  const list = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: "all",
    limit: 10,
  });
  const active = list.data.find((s) => ["active", "trialing"].includes(s.status));

  if (!active) {
    await users.updateOne(
      { discordId: token.discordId },
      { $set: { premium: false, status: "canceled", updatedAt: new Date() } }
    );
    return NextResponse.json({ premium: false, status: "canceled" }, { status: 200 });
  }

  const price = active.items?.data?.[0]?.price;
  const plan = price?.id || undefined;
  const role = deriveTierFromPrice(plan);

  await users.updateOne(
    { discordId: session.user.discordId },
    {
      $set: {
        subscriptionId: active.id,
        status: active.status,
        currentPeriodEnd: active.current_period_end || undefined,
        cancelAtPeriodEnd: Boolean(active.cancel_at_period_end),
        plan,
        premium: true,
        role,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ premium: true, role, plan }, { status: 200 });
}


