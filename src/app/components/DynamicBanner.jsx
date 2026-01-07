"use client";
import { useCallback, useState } from "react";

const TYPE_CONFIG = {
  feature: {
    label: "Feature Spotlight",
    icon: "🚀",
    container:
      "bg-gradient-to-r from-sky-500/20 via-indigo-500/10 to-purple-500/10 border border-white/20 text-slate-100 shadow-[0_0_30px_rgba(15,23,42,0.35)]",
    pill: "bg-white/10 text-white",
  },
  warning: {
    label: "Maintenance",
    icon: "🛠️",
    container:
      "bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/40 border border-amber-200/60 text-white shadow-[0_0_25px_rgba(15,23,42,0.35)]",
    pill: "bg-amber-600/80 text-white",
  },
  outage: {
    label: "Outage Notice",
    icon: "⚡",
    container:
      "bg-gradient-to-r from-rose-600/30 via-rose-500/10 to-rose-600/40 border border-rose-400/60 text-white shadow-[0_0_30px_rgba(15,23,42,0.45)]",
    pill: "bg-red-600/80 text-white",
  },
};

export default function DynamicBanner({ banner }) {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = useCallback(() => setIsOpen(false), []);

  if (!banner || !isOpen) {
    return null;
  }

  const config = TYPE_CONFIG[banner.type] ?? TYPE_CONFIG.feature;

  return (
    <section
      aria-live="polite"
      role="status"
      className={`relative w-full ${config.container} rounded-b-2xl pt-4 pb-4 sm:pt-5 sm:pb-5`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center">
        <span
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${config.pill}`}
        >
          <span aria-hidden="true">{config.icon}</span>
          {config.label}
        </span>
        <p className="max-w-4xl text-base leading-6 text-inherit">{banner.content}</p>
      </div>
      <button
        onClick={handleClose}
        aria-label="Dismiss banner"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-xs font-bold text-white outline outline-1 outline-white/40 transition hover:bg-black/60"
      >
        ✕
      </button>
    </section>
  );
}
