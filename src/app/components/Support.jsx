"use client";
import React, { useEffect } from "react";

const Support = () => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AstroStats • Support";
    }
  }, []);

  const DISCORD_SERVER_URL = "https://discord.gg/BeszQxTn9D";

  return (
    <div className="w-full my-10">
      <section className="relative mx-auto max-w-5xl px-4">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute top-20 left-6 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Get Support
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#adb7be] max-w-2xl mx-auto">
            Join our Discord community for bugs, feature requests, and everything AstroStats
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />
        </header>

        {/* Main Discord CTA Card */}
        <div className="mx-auto max-w-3xl mb-10">
          <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-8 md:p-10">
              <div className="flex flex-col items-center text-center gap-6">
                {/* Discord Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600/30 rounded-full blur-xl" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Join Our Discord Server
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg max-w-lg mx-auto">
                    Get help from our community, report bugs, suggest features, and stay updated with the latest AstroStats news
                  </p>
                </div>

                {/* CTA Button */}
                <a
                  href={DISCORD_SERVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Join Discord Server
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                {/* Server info */}
                <p className="text-sm text-gray-400">
                  Instant access • Active community • Fast responses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Report Bugs</h3>
            <p className="text-gray-300 text-sm">
              Found an issue? Let us know in our dedicated bug reports channel with details and screenshots
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Request Features</h3>
            <p className="text-gray-300 text-sm">
              Have an idea? Share your feature requests and vote on suggestions from the community
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-violet-600/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Get Help</h3>
            <p className="text-gray-300 text-sm">
              Need assistance? Our support team and community are ready to help you troubleshoot any issues
            </p>
          </div>
        </div>

        {/* Information section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-xl bg-gray-900/40 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">What to Include</h3>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Clear description of the issue or feature request</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Steps to reproduce bugs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Screenshots or videos when applicable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Your server ID and relevant command information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gray-900/40 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">Response Times</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Our team monitors Discord regularly and aims to respond to all support requests within 24-48 hours.
                </p>
                <p className="text-gray-300 text-sm">
                  Community members often provide help even faster!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;
