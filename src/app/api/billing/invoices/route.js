import { getToken } from "next-auth/jwt";
import { getUsersCollection } from "../../../../lib/mongo";
import { stripe } from "../../../../lib/stripe";
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
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ invoices: [] }, { status: 200 });
  }

  const list = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: 5,
    expand: ["data.charge"],
  });

  const invoices = (list.data || []).map((inv) => ({
    id: inv.id,
    number: inv.number || inv.id,
    amount_paid: inv.amount_paid,
    amount_due: inv.amount_due,
    currency: inv.currency,
    status: inv.status,
    hosted_invoice_url: inv.hosted_invoice_url,
    created: inv.created,
  }));

  return NextResponse.json({ invoices }, { status: 200 });
}


