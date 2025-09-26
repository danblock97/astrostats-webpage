"use client";
import React, { useEffect } from "react";

const Support = () => {
  // Minimal page title for clarity
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AstroStats • Support";
    }
  }, []);

  const DISCORD_BOT_ISSUES_URL = "https://github.com/danblock97/AstroStats/issues";
  const SUPPORT_SITE_ISSUES_URL =
    "https://github.com/danblock97/astrostats-webpage/issues";

  return (
    <div className="w-full my-10">
      <section className="relative mx-auto max-w-5xl px-4">
        {/* Subtle decorative background, matching app theme */}
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute top-20 left-6 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
        </div>
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Support</span>
          </h1>
          <p className="mt-3 text-[#adb7be]">
            Get help, report issues, and see what’s coming next.
          </p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />
        </header>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {/* Primary: support site bug report (brand gradient) */}
          <a
            href={SUPPORT_SITE_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:opacity-90 transition"
          >
            Report a site bug
          </a>
          {/* Secondary: Discord bot issues & features (thin, gradient border) */}
          <a
            href={DISCORD_BOT_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-1 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 transition"
          >
            <span className="block rounded-full bg-[#121212] px-5 py-1.5 text-white font-medium">Discord bot issues & feature requests</span>
          </a>
        </div>

        {/* On‑brand info cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Bug reporting</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Include steps to reproduce, expected vs actual results, and your browser/OS. Screenshots or short clips help a lot.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Issue tracker & updates</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Track reported bugs, planned improvements, and feature ideas in GitHub Issues.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Troubleshooting checklist</h2>
            <ul className="mt-2 text-gray-300 text-sm space-y-2 list-disc list-inside marker:text-purple-300">
              <li>Re-invite the bot and confirm required permissions.</li>
              <li>Check command syntax and required arguments.</li>
              <li>Try again after a minute in case of rate limits.</li>
              <li>See if the issue or request already exists in GitHub Issues.</li>
            </ul>
          </div>
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Include in your report</h2>
            <ul className="mt-2 text-gray-300 text-sm space-y-2 list-disc list-inside marker:text-purple-300">
              <li>Steps to reproduce and expected vs actual behavior.</li>
              <li>Server ID (and channel/command used if relevant).</li>
              <li>Screenshot/video if UI or message content is involved.</li>
              <li>Time of occurrence and frequency.</li>
            </ul>
          </div>
        </div>

        {/* Support policy */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-gray-900/30 border border-white/10">
            <h3 className="text-white font-semibold">Coverage & scope</h3>
            <p className="mt-2 text-gray-300 text-sm">
              We support Discord usage and the features documented in Commands. Game APIs can be rate‑limited; temporary delays may occur.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gray-900/30 border border-white/10">
            <h3 className="text-white font-semibold">Response times</h3>
            <p className="mt-2 text-gray-300 text-sm">
              We aim to review new bug reports within 24–48 hours. Premium users may receive priority handling where applicable.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
