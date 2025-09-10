import Stripe from "stripe";

let stripeInstance;

function initStripe() {
  if (!stripeInstance) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    stripeInstance = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });
  }
  return stripeInstance;
}

// Keep existing imports working: `import { stripe } from "../lib/stripe"`
// This proxy defers initialization until a property is accessed at runtime.
export const stripe = new Proxy(
  {},
  {
    get(_target, prop) {
      const s = initStripe();
      // @ts-ignore - index signature passthrough
      return s[prop];
    },
  }
);

export function getStripe() {
  return initStripe();
}

