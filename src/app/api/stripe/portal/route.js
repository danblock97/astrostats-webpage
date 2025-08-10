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

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: token.discordId });
  if (!user?.stripeCustomerId) {
    return new NextResponse("No Stripe customer", { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/account`,
  });

  return NextResponse.json({ url: portal.url }, { status: 200 });
}


