"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

function Feature({ children }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircleIcon className="mt-0.5 h-5 w-5 text-emerald-400" />
      <span className="text-sm text-gray-200">{children}</span>
    </li>
  );
}

// Hardcoded public pricing (pence). Yearly reflects ~20% discount vs 12x monthly
const PRICES = {
  supporter: { monthly: 300, yearly: 3000 }, // £3/mo or £30/yr → £2.50/mo effective
  sponsor: { monthly: 500, yearly: 4800 },   // £5/mo or £48/yr → £4.00/mo effective
  vip: { monthly: 1000, yearly: 9600 },      // £10/mo or £96/yr → £8.00/mo effective
};

const TIERS = [
  {
    key: "supporter",
    label: "Supporter",
    accent: "from-sky-900/50 to-sky-900/20",
    iconBg: "bg-cyan-400",
    ribbon: null,
    features: [
      "2+ extra daily pet quests",
      "Access to future premium commands",
      "Premium badge on your profile",
      "20 people squibgames sessions",
    ],
  },
  {
    key: "sponsor",
    label: "Sponsor",
    accent: "from-fuchsia-900/60 to-fuchsia-900/30",
    iconBg: "bg-pink-500",
    ribbon: "Most Popular",
    features: [
      "5+ extra daily pet quests",
      "1+ extra pet",
      "Access to future premium commands",
      "Premium badge on your profile",
      "50 people squibgames sessions",
    ],
  },
  {
    key: "vip",
    label: "VIP",
    accent: "from-amber-900/50 to-amber-900/20",
    iconBg: "bg-amber-400",
    ribbon: null,
    features: [
      "8+ extra daily pet quests",
      "3+ extra pets",
      "Access to future premium commands",
      "Premium badge on your profile",
      "75 people squibgames sessions",
    ],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("monthly");
  const [me, setMe] = useState({ premium: false, planDuration: "free", planTier: null });
  const COMING_SOON = false;

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch("/api/me").catch(() => null);
        if (meRes?.ok) setMe(await meRes.json());
      } catch {}
    };
    load();
  }, []);

  const currency = "£";

  function formatAmountPence(pence) {
    if (typeof pence !== "number") return "—";
    const pounds = pence / 100;
    // Show whole numbers where possible, else one decimal
    const str = Number.isInteger(pounds) ? pounds.toString() : pounds.toFixed(2);
    return `${currency}${str}`;
  }

  function getAmountPence(tierKey, dur) {
    return PRICES[tierKey]?.[dur] ?? null;
  }

  const discountPercent = useMemo(() => {
    const m = getAmountPence("sponsor", "monthly");
    const y = getAmountPence("sponsor", "yearly");
    if (m == null || y == null) return null;
    const perMonthYearly = y / 12;
    const pct = Math.round((1 - perMonthYearly / m) * 100);
    return pct > 0 ? pct : null;
  }, []);

  async function startCheckout(tierKey) {
    if (!session) return signIn("discord");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierKey, duration }),
      });
      if (!res.ok) {
        let details = "";
        try {
          const data = await res.json();
          details = data?.error
            ? `${data.error}. Tier: ${data?.received?.tier ?? "?"}, Duration: ${data?.received?.duration ?? "?"}`
            : JSON.stringify(data);
          // Also log expanded hint for developers
          console.error("/api/stripe/checkout error", data);
        } catch (_) {
          details = await res.text();
        }
        throw new Error(details || "Failed to create checkout session");
      }
      const data = await res.json();
      window.location.href = data.url;
    } catch (e) {
      alert(e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#05060a] text-white">
      <div className={COMING_SOON ? "blur-[2px] md:blur-[3px] pointer-events-none select-none" : undefined}>
      <section className="relative isolate flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 py-20 md:py-28">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">AstroStats Premium</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">50% of all proceeds go directly to cancer research UK.</p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur">
            <span className={`rounded-full px-3 py-1 text-sm ${duration === "monthly" ? "bg-white/20 text-white" : "text-white/80"}`}>Monthly</span>
            <button
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${duration === "yearly" ? "bg-black/30" : "bg-black/20"}`}
              onClick={() => setDuration(duration === "monthly" ? "yearly" : "monthly")}
              aria-label="Toggle billing period"
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${duration === "yearly" ? "translate-x-8" : "translate-x-1"}`} />
            </button>
            <span className={`rounded-full px-3 py-1 text-sm ${duration === "yearly" ? "bg-white/20 text-white" : "text-white/80"}`}>Yearly</span>
            {duration === "yearly" && discountPercent && (
              <span className="ml-1 rounded-full bg-emerald-600/30 px-2 py-0.5 text-xs text-emerald-100">{discountPercent}% off!</span>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-14 px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-3">
          {TIERS.map((t) => {
            const monthlyAmount = getAmountPence(t.key, "monthly");
            const yearlyAmount = getAmountPence(t.key, "yearly");
            const priceDisplay = duration === "monthly"
              ? `${formatAmountPence(monthlyAmount)}/month`
              : `${formatAmountPence((yearlyAmount ?? 0) / 12)}/month`;
            const billedDisplay = duration === "yearly"
              ? `Billed at ${yearlyAmount != null ? formatAmountPence(yearlyAmount) : "—"}/year`
              : "Billed monthly";

            const isCurrent = me?.premium && me?.planTier === t.key && me?.planDuration === duration;

            return (
              <div key={t.key} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b ${t.accent} p-8 shadow-2xl shadow-black/20 ring-1 ring-inset ring-white/10 transition-transform duration-300 hover:-translate-y-1`}>
                {t.ribbon && (
                  <div className="absolute right-0 top-6 -mr-12 rotate-45 bg-fuchsia-500 px-12 py-1 text-xs font-semibold text-white shadow-md">{t.ribbon}</div>
                )}
                <div className="mb-3 text-sm uppercase tracking-wider text-white/80">{t.label}</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-extrabold">{priceDisplay}</div>
                </div>
                <div className="mt-1 text-xs text-gray-300">{billedDisplay}</div>

                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <Feature key={f}>{f}</Feature>
                  ))}
                </ul>
                <div className="flex-1" />

                <button
                  className={`mt-8 w-full rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 ${isCurrent ? "bg-white/10 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"}`}
                  onClick={() => startCheckout(t.key)}
                  disabled={COMING_SOON || loading || (duration === "monthly" ? monthlyAmount == null : yearlyAmount == null) || isCurrent}
                >
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-2 text-emerald-300"><CheckCircleIcon className="h-5 w-5"/> Current plan</span>
                  ) : (
                    COMING_SOON ? "Coming soon" : session ? "Upgrade" : "Login to purchase"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center text-sm text-gray-300">
          <p>Payments are processed securely by <span className="font-semibold text-white">Stripe</span>. We contribute <span className="font-semibold text-white">1% of all proceeds</span> to <span className="font-semibold text-white">Stripe Climate</span>.</p>
        </div>
      </div>
      </div>
      {/* Coming soon overlay */}
      {COMING_SOON && (
        <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-2xl bg-white/10 px-6 py-5 md:px-10 md:py-8 text-center shadow-2xl ring-1 ring-white/20 backdrop-blur-xl">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Premium Coming Soon</div>
            <p className="mt-2 text-sm md:text-base text-white/90">You can preview pricing now. Subscriptions will open shortly.</p>
          </div>
        </div>
      )}
    </main>
  );
}

