"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckCircleIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

function Perk({ label, included }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      {included ? (
        <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
      ) : (
        <XMarkIcon className="h-5 w-5 text-gray-500" />
      )}
      <span className="text-sm text-gray-200">{label}</span>
    </div>
  );
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) setMe(await res.json());
      } catch {}
    };
    load();
  }, []);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create portal session");
      const data = await res.json();
      window.location.href = data.url;
    } catch (e) {
      alert(e.message || "Portal failed");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <div className="text-white mt-28 px-6">Loading…</div>;
  }

  if (!session) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0d13] text-white">
        {/* ambient */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl animate-float" />

        {/* Discord-style card */}
        <div className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
          {/* header */}
          <div className="relative bg-[#5865F2] px-6 py-6">
            <div className="text-center text-xl font-extrabold tracking-widest text-white">DISCORD</div>
            {/* wave divider */}
            <svg className="absolute bottom-0 left-0 h-6 w-full text-[#4e59d9]" viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M0,32L60,26.7C120,21,240,11,360,13.3C480,16,600,32,720,42.7C840,53,960,59,1080,53.3C1200,48,1320,32,1380,24L1440,16L1440,64L1380,64C1320,64,1200,64,1080,64C960,64,840,64,720,64C600,64,480,64,360,64C240,64,120,64,60,64L0,64Z"/>
            </svg>
          </div>
          {/* body */}
          <div className="bg-[#11131a]/90 px-8 pb-8 pt-6">
            <p className="text-center text-gray-300">Sign in with Discord to manage your subscription.</p>
            <button
              onClick={() => signIn("discord")}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:bg-[#4752C4]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" className="h-5 w-5 fill-white"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,48,6.83,72.37,72.37,0,0,0,44.66,0,105.89,105.89,0,0,0,18.39,8.09C2.62,32.65-1.52,56.6.49,80.21A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.16,26.64,26.64,0,0,0,3.24-2.52,75.57,75.57,0,0,0,62.22,0,26.05,26.05,0,0,0,3.24,2.52,68.86,68.86,0,0,1-10.87,5.18,77,77,0,0,0,6.88,11.1A105.25,105.25,0,0,0,126.65,80.2C128.91,54.34,122.09,30.52,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.46-12.74S54,46,53.92,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.23,60,73.23,53s5-12.74,11.46-12.74S96.3,46,96.22,53,91,65.69,84.69,65.69Z"/></svg>
              Continue with Discord
            </button>
            <p className="mt-4 text-center text-xs text-gray-500">By continuing, you agree to our Terms and Privacy Policy.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <div className="mx-auto mt-24 w-full max-w-7xl px-6 pb-28">
        {/* Header card spanning full width */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={session.user?.image || "/images/astrostats.png"} alt="avatar" className="h-14 w-14 rounded-full ring-2 ring-white/30" />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">{session.user?.name}</h1>
                <p className="text-white/90">{me?.premium ? "Premium member" : "Free plan"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/pricing" className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/30">Change plan</a>
              <button onClick={openPortal} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-black/30 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/30 transition hover:bg-black/40 disabled:opacity-50">
                {loading ? "Opening…" : "Manage billing"}
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content grid: sidebar + main content + insights */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <nav className="space-y-1 text-sm">
                <a href="#overview" className="block rounded px-3 py-2 hover:bg-white/10">Overview</a>
                <a href="#billing" className="block rounded px-3 py-2 hover:bg-white/10">Billing</a>
                <a href="#perks" className="block rounded px-3 py-2 hover:bg-white/10">Perks</a>
                <a href="/support" className="block rounded px-3 py-2 hover:bg-white/10">Support</a>
                <button onClick={() => signOut()} className="mt-2 w-full rounded px-3 py-2 text-left hover:bg-white/10">Sign out</button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <section id="overview" className="lg:col-span-9 space-y-8">
            <div id="billing" className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              {/* Subscription overview */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-semibold">Subscription</h2>
                <p className="mt-1 text-gray-300">Premium unlocks more pets, quests, and larger SquibGames sessions.</p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-gray-400">Status</div>
                    <div className={`mt-1 inline-flex items-center gap-2 font-medium ${me?.premium ? "text-emerald-300" : "text-gray-200"}`}>
                      {me?.premium ? <CheckCircleIcon className="h-5 w-5" /> : <XMarkIcon className="h-5 w-5 text-gray-400" />} {me?.premium ? "Active" : "Free"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-gray-400">Billing period</div>
                    <div className="mt-1 font-medium capitalize">{me?.premium ? (me?.planDuration || "monthly") : "—"}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-gray-400">Renewal</div>
                    <div className="mt-1 font-medium">{me?.currentPeriodEnd ? new Date(me.currentPeriodEnd * 1000).toLocaleDateString() : "—"}</div>
                  </div>
                </div>
              </div>

              {/* Billing + invoices */}
              <BillingBlock onOpenPortal={openPortal} loading={loading} />
            </div>

            {/* Perks */}
            <div id="perks" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-lg font-semibold">Your perks</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Perk label="All commands" included />
                <Perk label="Pets: 1" included={!me?.premium} />
                <Perk label="Pets: 3" included={!!me?.premium} />
                <Perk label="Daily quests: 3" included />
                <Perk label="+3 extra daily quests" included={!!me?.premium} />
                <Perk label="XP multiplier: 1x" included={!me?.premium} />
                <Perk label="XP multiplier: 1.2x" included={!!me?.premium} />
                <Perk label="SquibGames: 15 players" included={!me?.premium} />
                <Perk label="SquibGames: 50 players" included={!!me?.premium} />
              </div>
              {!me?.premium && (
                <div className="mt-6 text-sm text-gray-300">Want more? Upgrade on the <a href="/pricing" className="text-indigo-300 underline">Pricing</a> page.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


function BillingBlock({ onOpenPortal, loading }) {
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/billing/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
        }
      } catch {}
    };
    load();
  }, []);

  return (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.02] p-10">
      <h2 className="text-xl font-semibold">Billing & invoices</h2>
              <p className="mt-2 max-w-2xl text-gray-300">Update payment methods, download invoices, or cancel in the billing portal.</p>
      <div className="mt-4">
        <button onClick={onOpenPortal} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 transition hover:bg-white/20 disabled:opacity-50">
          {loading ? "Opening portal…" : "Open billing portal"}
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white/90">Recent invoices</h3>
        {invoices.length === 0 ? (
          <p className="mt-2 text-sm text-gray-400">No invoices yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/5 rounded-xl border border-white/10">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <div className="text-sm text-white/90">{inv.number}</div>
                  <div className="text-xs text-gray-400">{new Date(inv.created * 1000).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-200">£{(inv.amount_paid || inv.amount_due) / 100}</div>
                  {inv.hosted_invoice_url && (
                    <a href={inv.hosted_invoice_url} target="_blank" className="text-xs text-indigo-300 underline">View</a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

