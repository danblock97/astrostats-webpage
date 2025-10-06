"use client";
import React, { useEffect } from "react";

const Support = () => {
  // Minimal page title for clarity
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AstroStats • Support";
    }
  }, []);

  const SUPPORT_SITE_BUG_URL = "https://danblock97.atlassian.net/jira/software/c/form/13d822b1-3696-48be-935c-457148c78b91?atlOrigin=eyJpIjoiMTBkMTRjYWUwZTE2NDJhMGFmYjczMjkyMzVlNzg1ZjgiLCJwIjoiaiJ9";
  const SUPPORT_SITE_FEATURE_URL = "https://danblock97.atlassian.net/jira/software/c/form/ce09356c-5fda-4e58-aed7-061a3d67672a?atlOrigin=eyJpIjoiMTc0NmZiZDhjNzZhNDA1ZDgxYjVjMjExM2I0ZjE1NzYiLCJwIjoiaiJ9";
  const DISCORD_BOT_BUG_URL = "https://danblock97.atlassian.net/jira/software/c/form/c31187ff-4e38-40dd-aafd-261adcb7722d?atlOrigin=eyJpIjoiMjE5ZmM1ZDZmMzRkNDAyNzljZDE1NGZhODdjNWVhN2IiLCJwIjoiaiJ9";
  const DISCORD_BOT_FEATURE_URL = "https://danblock97.atlassian.net/jira/software/c/form/9b68dccf-5be1-4817-b3f5-102b974e025a?atlOrigin=eyJpIjoiYTA3ZDFjOTFjNzA2NGVhYzk0ZjYyMGYyYzEyYjEzYmUiLCJwIjoiaiJ9";

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
            Get help, report issues, and request features.
          </p>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />
        </header>

        {/* Support Site Section */}
        <div className="mt-10">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Support Site
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={SUPPORT_SITE_BUG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:opacity-90 transition text-center"
            >
              Report Bug
            </a>
            <a
              href={SUPPORT_SITE_FEATURE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 transition"
            >
              <span className="block rounded-full bg-[#121212] px-5 py-1.5 text-white font-medium text-center">Request Feature</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>

        {/* Discord Bot Section */}
        <div className="mt-8">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord Bot
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={DISCORD_BOT_BUG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 transition text-center"
            >
              Report Bug
            </a>
            <a
              href={DISCORD_BOT_FEATURE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition"
            >
              <span className="block rounded-full bg-[#121212] px-5 py-1.5 text-white font-medium text-center">Request Feature</span>
            </a>
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
            <h2 className="text-white font-semibold">Issue tracker & updates</h2>
            <p className="mt-2 text-gray-300 text-sm">
              Track reported bugs, planned improvements, and feature ideas through our support forms.
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
