import { stripe } from "../../../../lib/stripe";
import { getUsersCollection } from "../../../../lib/mongo";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";

export async function POST(request) {
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new NextResponse("Webhook secret not configured", { status: 500 });

  const rawBody = await request.arrayBuffer();
  const rawBuffer = Buffer.from(rawBody);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBuffer, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handling error", e);
    return new NextResponse("Webhook error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session) {
  const customerId = session.customer;
  const discordId = session.metadata?.discordId;
  const subscriptionId = session.subscription;
  if (!discordId) return;

  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  await upsertPremiumFromSubscription(discordId, customerId, sub);
}

async function handleSubscriptionChange(subscription) {
  let discordId = subscription.metadata?.discordId;
  const customerId = subscription.customer;
  if (!discordId && customerId) {
    const cust = await stripe.customers.retrieve(customerId);
    if (cust?.metadata?.discordId) discordId = cust.metadata.discordId;
  }
  if (!discordId) return;
  await upsertPremiumFromSubscription(discordId, customerId, subscription);
}

async function upsertPremiumFromSubscription(discordId, customerId, subscription) {
  const users = await getUsersCollection();
  const status = subscription.status;
  const currentPeriodEnd = subscription.current_period_end
    ? subscription.current_period_end
    : undefined;
  const cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end);
  const price = subscription.items?.data?.[0]?.price;
  const plan = price?.id || undefined;

  const premium = status === "active" || status === "trialing";
  const role = deriveTierFromPrice(plan);

  await users.updateOne(
    { discordId },
    {
      $set: {
        stripeCustomerId: customerId,
        subscriptionId: subscription.id,
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        plan,
        premium,
        role,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

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


