import { stripe } from "../../../lib/stripe";
import { getUsersCollection } from "../../../lib/mongo";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(500).end("Webhook secret not configured");

  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).end("Bad signature");
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
    return res.status(500).end("Webhook error");
  }

  return res.json({ received: true });
}

import { Readable } from "stream";
function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
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
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}


