import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getUsersCollection } from "../../../lib/mongo";
import { stripe } from "../../../lib/stripe";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.discordId) return res.status(401).end("Unauthorized");

  const users = await getUsersCollection();
  const user = await users.findOne({ discordId: session.user.discordId });
  if (!user?.stripeCustomerId) {
    return res.status(200).json({ invoices: [] });
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

  return res.status(200).json({ invoices });
}


