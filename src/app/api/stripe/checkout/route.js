import { getToken } from "next-auth/jwt";
import { stripe } from "../../../../lib/stripe";
import { getUsersCollection } from "../../../../lib/mongo";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.discordId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { plan, priceId: directPriceId, tier, duration } = body || {};
  let priceId = directPriceId;
  const billingKey = duration || plan;
  const tierKey = (tier || "sponsor").toLowerCase();
  if (!priceId && billingKey) {
    const T = tierKey.toUpperCase();
    const D = billingKey.toUpperCase();
    const primary = process.env[`STRIPE_PRICE_${T}_${D}`];
    const alt = process.env[`STRIPE_PRICE_PREMIUM_${D}_${T}`];
    const legacy = tierKey === "sponsor" ? process.env[`STRIPE_PRICE_PREMIUM_${D}`] : undefined;
    priceId = primary || alt || legacy;
  }
  if (!priceId) {
    if (tierKey === "sponsor") {
      const legacy = {
        monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
      };
      priceId = legacy[billingKey];
    }
  }

  if (!priceId) {
    return NextResponse.json(
      {
        error: "Missing plan/priceId",
        hint:
          "Ensure STRIPE_PRICE_<TIER>_<DURATION> env vars are set and restart the dev server.",
        received: { tier: tierKey, duration: billingKey },
        expectedEnv: {
          supporter: [
            "STRIPE_PRICE_SUPPORTER_MONTHLY",
            "STRIPE_PRICE_SUPPORTER_YEARLY",
            "STRIPE_PRICE_PREMIUM_MONTHLY_SUPPORTER",
            "STRIPE_PRICE_PREMIUM_YEARLY_SUPPORTER",
          ],
          sponsor: [
            "STRIPE_PRICE_SPONSOR_MONTHLY",
            "STRIPE_PRICE_SPONSOR_YEARLY",
            "STRIPE_PRICE_PREMIUM_MONTHLY_SPONSOR",
            "STRIPE_PRICE_PREMIUM_YEARLY_SPONSOR",
            "STRIPE_PRICE_PREMIUM_MONTHLY",
            "STRIPE_PRICE_PREMIUM_YEARLY",
          ],
          vip: [
            "STRIPE_PRICE_VIP_MONTHLY",
            "STRIPE_PRICE_VIP_YEARLY",
            "STRIPE_PRICE_PREMIUM_MONTHLY_VIP",
            "STRIPE_PRICE_PREMIUM_YEARLY_VIP",
          ],
        },
      },
      { status: 400 }
    );
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: token.discordId });
  let customerId = user?.stripeCustomerId;
  if (!customerId) {
    // Create new Stripe customer with email and name if available
    const customerData = {
      metadata: { discordId: token.discordId },
    };
    if (user?.email) customerData.email = user.email;
    if (user?.username) customerData.name = user.username;
    
    const customer = await stripe.customers.create(customerData);
    customerId = customer.id;
    await users.updateOne(
      { discordId: token.discordId },
      { $set: { stripeCustomerId: customerId, updatedAt: new Date() } }
    );
  } else {
    // Update existing customer if email/name is missing in Stripe
    try {
      const existingCustomer = await stripe.customers.retrieve(customerId);
      const needsUpdate = 
        (!existingCustomer.email && user?.email) || 
        (!existingCustomer.name && user?.username);
      
      if (needsUpdate) {
        const updateData = {};
        if (!existingCustomer.email && user?.email) updateData.email = user.email;
        if (!existingCustomer.name && user?.username) updateData.name = user.username;
        await stripe.customers.update(customerId, updateData);
      }
    } catch (err) {
      console.error("Failed to update existing Stripe customer:", err);
      // Continue anyway - not critical
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    success_url: `${appUrl}/account?success=1`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    metadata: { discordId: token.discordId },
  });

  return NextResponse.json({ url: checkout.url }, { status: 200 });
}


