"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";


function Feature({ children, highlight }) {
	// Check if the text contains placeholders to adjust styling
	const hasPlaceholders =
		typeof children === "string" && children.includes("{");

	return (
		<li className="flex items-start gap-2">
			<CheckCircleIcon
				className={`shrink-0 ${
					hasPlaceholders ? "mt-1.5" : "mt-[2px]"
				} h-4 w-4 ${highlight ? "text-emerald-400" : "text-emerald-600/60"}`}
			/>
			<span
				className={`text-sm ${
					hasPlaceholders ? "leading-relaxed" : "leading-5"
				} ${highlight ? "text-gray-200" : "text-gray-400"}`}
			>
				{children}
			</span>
		</li>
	);
}

function FeatureCategory({ title, features }) {
	return (
		<div className="mb-4">
			<h3 className="mb-2 text-sm font-semibold text-white/70 uppercase tracking-wider">
				{title}
			</h3>
			<ul className="space-y-2">
				{features.map((feature) => (
					<Feature key={feature} highlight={true}>
						{feature}
					</Feature>
				))}
			</ul>
		</div>
	);
}

// Hardcoded public pricing (pence). Yearly reflects ~20% discount vs 12x monthly
const PRICES = {
	supporter: { monthly: 300, yearly: 3000 }, // £3/mo or £30/yr → £2.50/mo effective
	sponsor: { monthly: 500, yearly: 4800 }, // £5/mo or £48/yr → £4.00/mo effective
	vip: { monthly: 1000, yearly: 9600 }, // £10/mo or £96/yr → £8.00/mo effective
};

// Tier hierarchy for upgrade/downgrade logic (higher number = higher tier)
const TIER_RANK = {
	supporter: 1,
	sponsor: 2,
	vip: 3,
};

const FEATURE_CATEGORIES = {
	WELCOME: "Welcome System",
	PETS: "Pet Battles",
	SQUIB: "Squib Games",
	GENERAL: "General Features",
};

const TIERS = [
	{
		key: "supporter",
		label: "Supporter",
		accent: "from-sky-900/50 to-sky-900/20",
		iconBg: "bg-cyan-400",
		ribbon: null,
		features: {
			[FEATURE_CATEGORIES.WELCOME]: [
				"Custom welcome messages with placeholders ({user}, {server}, etc)",
			],
			[FEATURE_CATEGORIES.PETS]: [
				"1 pet capacity (same as free tier)",
				"5 daily quests (+2 bonus)",
				"1.2x XP and cash multiplier",
			],
			[FEATURE_CATEGORIES.SQUIB]: ["20 player capacity maximum"],
			[FEATURE_CATEGORIES.GENERAL]: [
				"⭐ Premium badge in stats",
				"Access to premium-only commands",
				"Priority support",
			],
		},
	},
	{
		key: "sponsor",
		label: "Sponsor",
		accent: "from-fuchsia-900/60 to-fuchsia-900/30",
		iconBg: "bg-pink-500",
		ribbon: "Most Popular",
		features: {
			[FEATURE_CATEGORIES.WELCOME]: [
				"Custom welcome messages with placeholders",
				"Custom welcome images (PNG, JPG, WEBP, GIF)",
				"Animated GIF support with auto-compression",
			],
			[FEATURE_CATEGORIES.PETS]: [
				"2 pet capacity (+1 extra pet)",
				"8 daily quests (+5 bonus)",
				"1.5x XP and cash multiplier",
				"Enhanced pet battle features",
			],
			[FEATURE_CATEGORIES.SQUIB]: ["50 player capacity maximum"],
			[FEATURE_CATEGORIES.GENERAL]: [
				"⭐ Sponsor badge recognition",
				"Access to premium-only commands",
				"Priority support",
			],
		},
	},
	{
		key: "vip",
		label: "VIP",
		accent: "from-amber-900/50 to-amber-900/20",
		iconBg: "bg-amber-400",
		ribbon: null,
		features: {
			[FEATURE_CATEGORIES.WELCOME]: [
				"Custom welcome messages with placeholders",
				"Custom welcome images (PNG, JPG, WEBP, GIF)",
				"Animated GIF support with auto-compression",
			],
			[FEATURE_CATEGORIES.PETS]: [
				"4 pet capacity (+3 extra pets)",
				"11 daily quests (+8 bonus)",
				"1.75x XP and cash multiplier",
				"Enhanced pet battle features",
			],
			[FEATURE_CATEGORIES.SQUIB]: ["75 player capacity maximum"],
			[FEATURE_CATEGORIES.GENERAL]: [
				"⭐ VIP badge recognition",
				"All premium features unlocked",
				"Premium support priority",
			],
		},
	},
];

export default function PricingPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [duration, setDuration] = useState("monthly");
	const [me, setMe] = useState({
		premium: false,
		planDuration: "free",
		planTier: null,
	});
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
		const str = Number.isInteger(pounds)
			? pounds.toString()
			: pounds.toFixed(2);
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
						? `${data.error}. Tier: ${data?.received?.tier ?? "?"}, Duration: ${
								data?.received?.duration ?? "?"
						  }`
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
			<div
				className={
					COMING_SOON
						? "blur-[2px] md:blur-[3px] pointer-events-none select-none"
						: undefined
				}
			>
				<section className="relative isolate flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 py-20 md:py-28">
					<div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
					<div className="container mx-auto px-6 text-center">
						<h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
							AstroStats Premium
						</h1>
						<div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur">
							<span
								className={`rounded-full px-3 py-1 text-sm ${
									duration === "monthly"
										? "bg-white/20 text-white"
										: "text-white/80"
								}`}
							>
								Monthly
							</span>
							<button
								className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
									duration === "yearly" ? "bg-black/30" : "bg-black/20"
								}`}
								onClick={() =>
									setDuration(duration === "monthly" ? "yearly" : "monthly")
								}
								aria-label="Toggle billing period"
							>
								<span
									className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
										duration === "yearly" ? "translate-x-8" : "translate-x-1"
									}`}
								/>
							</button>
							<span
								className={`rounded-full px-3 py-1 text-sm ${
									duration === "yearly"
										? "bg-white/20 text-white"
										: "text-white/80"
								}`}
							>
								Yearly
							</span>
							{duration === "yearly" && discountPercent && (
								<span className="ml-1 rounded-full bg-emerald-600/30 px-2 py-0.5 text-xs text-emerald-100">
									{discountPercent}% off!
								</span>
							)}
						</div>
					</div>
				</section>

				<div className="container mx-auto mt-14 px-6 pb-24">
					<div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-3">
						{TIERS.map((t) => {
							const monthlyAmount = getAmountPence(t.key, "monthly");
							const yearlyAmount = getAmountPence(t.key, "yearly");
							const priceDisplay =
								duration === "monthly"
									? `${formatAmountPence(monthlyAmount)}/month`
									: `${formatAmountPence((yearlyAmount ?? 0) / 12)}/month`;
							const billedDisplay =
								duration === "yearly"
									? `Billed at ${
											yearlyAmount != null
												? formatAmountPence(yearlyAmount)
												: "—"
									  }/year`
									: "Billed monthly";

							// Check if this is the user's current tier (regardless of duration)
							const isCurrentTier = me?.premium && me?.planTier === t.key;
							// Check if exact match (same tier AND same duration)
							const isExactMatch = isCurrentTier && (me?.planDuration === duration || me?.planDuration === "gifted");
							// Determine if this is an upgrade or downgrade based on tier hierarchy
							const userTierRank = me?.planTier ? TIER_RANK[me.planTier] || 0 : 0;
							const thisTierRank = TIER_RANK[t.key] || 0;
							const isDowngrade = me?.premium && userTierRank > thisTierRank;
							const isUpgrade = me?.premium && userTierRank < thisTierRank;
							// For gifted users, show current plan on their tier
							const isCurrent = isCurrentTier;

							return (
								<div
									key={t.key}
									className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b ${t.accent} p-8 shadow-2xl shadow-black/20 ring-1 ring-inset ring-white/10 transition-transform duration-300 hover:-translate-y-1`}
								>
									{t.ribbon && (
										<div className="absolute right-0 top-6 -mr-12 rotate-45 bg-fuchsia-500 px-12 py-1 text-xs font-semibold text-white shadow-md">
											{t.ribbon}
										</div>
									)}
									<div className="mb-3 text-sm uppercase tracking-wider text-white/80">
										{t.label}
									</div>
									<div className="flex items-baseline gap-3">
										<div className="text-4xl font-extrabold">
											{priceDisplay}
										</div>
									</div>
									<div className="mt-1 text-xs text-gray-300">
										{billedDisplay}
									</div>

									<div className="mt-6 space-y-6">
										{Object.entries(t.features).map(([category, features]) => (
											<FeatureCategory
												key={category}
												title={category}
												features={features}
											/>
										))}
									</div>
									<div className="flex-1" />

									<button
										className={`mt-8 w-full rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 ${
											t.key === "free"
												? "bg-white/10 cursor-not-allowed"
												: isCurrent
												? "bg-white/10 cursor-not-allowed"
												: isDowngrade
												? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500"
												: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
										}`}
										onClick={() => t.key !== "free" && !isCurrent && startCheckout(t.key)}
										disabled={
											t.key === "free" ||
											COMING_SOON ||
											loading ||
											(duration === "monthly"
												? monthlyAmount == null
												: yearlyAmount == null) ||
											isCurrent
										}
									>
										{t.key === "free" ? (
											"Current Plan"
										) : isCurrent ? (
											<span className="inline-flex items-center gap-2 text-emerald-300">
												<CheckCircleIcon className="h-5 w-5" /> Current Plan
											</span>
										) : COMING_SOON ? (
											"Coming soon"
										) : !session ? (
											"Login to purchase"
										) : isDowngrade ? (
											"Downgrade"
										) : (
											"Upgrade"
										)}
									</button>
								</div>
							);
						})}
					</div>

					<div className="mx-auto mt-10 max-w-3xl text-center text-sm text-gray-300">
						<p>
							Payments are processed securely by{" "}
							<span className="font-semibold text-white">Stripe</span>. We
							contribute{" "}
							<span className="font-semibold text-white">
								1% of all proceeds
							</span>{" "}
							to{" "}
							<span className="font-semibold text-white">Stripe Climate</span>.
						</p>
					</div>
				</div>
			</div>
			{/* Coming soon overlay */}
			{COMING_SOON && (
				<div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
					<div className="rounded-2xl bg-white/10 px-6 py-5 md:px-10 md:py-8 text-center shadow-2xl ring-1 ring-white/20 backdrop-blur-xl">
						<div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
							Premium Coming Soon
						</div>
						<p className="mt-2 text-sm md:text-base text-white/90">
							You can preview pricing now. Subscriptions will open shortly.
						</p>
					</div>
				</div>
			)}
		</main>
	);
}
