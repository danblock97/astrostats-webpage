"use client";
import React, { useEffect } from "react";

const Support = () => {
  // Minimal page title for clarity
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AstroStats • Support";
    }
  }, []);

  // Unified bug-report form (covers both site and Discord bot)
  const BUG_REPORT_FORM_URL =
    "https://www.notion.so/28df8761b6498137841fce83102c7139?pvs=106";

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
            Report bugs for the website or the Discord bot using one form.
          </p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />
        </header>

        {/* Unified bug-report entry */}
        <div className="mt-10 mx-auto max-w-3xl">
          <div className="rounded-xl border border-white/10 bg-gray-900/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Unified Bug Report</h2>
              </div>
              <p className="text-sm text-gray-300 max-w-prose">
                Use a single form to report issues for either the website or the Discord bot. Include steps to reproduce and any relevant screenshots.
              </p>
              <a
                href={BUG_REPORT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:opacity-90 transition text-center"
              >
                Report a Bug (Site or Bot)
              </a>
            </div>
          </div>
        </div>

        {/* On-brand info cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Bug reporting</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Include steps to reproduce, expected vs actual results, and your browser/OS. Screenshots or short clips help a lot.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Issue tracking</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Track reported bugs and planned improvements via our support form.
            </p>
          </div>
          <div className="p-5 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30">
            <h2 className="text-white font-semibold">Troubleshooting checklist</h2>
            <ul className="mt-2 text-gray-300 text-sm space-y-2 list-disc list-inside marker:text-purple-300">
              <li>Re-invite the bot and confirm required permissions.</li>
              <li>Check command syntax and required arguments.</li>
              <li>Try again after a minute in case of rate limits.</li>
              <li>Check if a similar issue has already been reported.</li>
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
              We support Discord usage and the features documented in Commands. Game APIs can be rate-limited; temporary delays may occur.
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
