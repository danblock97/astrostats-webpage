const DISCORD_SERVER_URL = "https://discord.gg/BeszQxTn9D";
const SUPPORT_EMAIL = "support@astrostats.info";
const GITHUB_ISSUES_URL = "https://github.com/danblock97/AstroStats/issues/new";

const channels = [
  {
    title: "GitHub Issues",
    eyebrow: "Best for bugs and feature requests",
    description:
      "Use GitHub Issues to report bot bugs, share reproducible problems, or suggest improvements we can track publicly.",
    href: GITHUB_ISSUES_URL,
    cta: "Open GitHub Issue",
    accent: "from-emerald-400 via-cyan-400 to-sky-500",
    shadow: "shadow-cyan-500/20",
    points: [
      "Bug reports with steps to reproduce",
      "Feature ideas and product feedback",
      "Technical issues that do not include private account details",
    ],
    icon: (
      <svg className="h-7 w-7 text-slate-950" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42c-.54-1.38-1.33-1.75-1.33-1.75c-1.09-.75.08-.73.08-.73c1.2.09 1.83 1.23 1.83 1.23c1.08 1.84 2.82 1.31 3.51 1c.11-.78.42-1.31.76-1.61c-2.67-.3-5.48-1.33-5.48-5.93c0-1.31.47-2.38 1.23-3.22c-.12-.3-.53-1.52.12-3.17c0 0 1-.32 3.3 1.23a11.42 11.42 0 0 1 6.01 0c2.3-1.55 3.3-1.23 3.3-1.23c.65 1.65.24 2.87.12 3.17c.77.84 1.23 1.91 1.23 3.22c0 4.61-2.82 5.62-5.5 5.92c.43.37.82 1.1.82 2.23v3.31c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    title: "Discord",
    eyebrow: "Best for quick help and community support",
    description:
      "Join the AstroStats Discord for setup help, quick questions, and community troubleshooting when you want a fast answer.",
    href: DISCORD_SERVER_URL,
    cta: "Join Discord",
    accent: "from-indigo-400 via-blue-500 to-cyan-400",
    shadow: "shadow-indigo-500/20",
    points: [
      "Fast questions about commands or setup",
      "Community help and workaround discussion",
      "Feedback that benefits from back-and-forth conversation",
    ],
    icon: (
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

const emailTopics = [
  "Stripe payment issues",
  "Subscription or billing questions",
  "Account access problems",
  "Website issues that need private account details",
];

const issueChecklist = [
  "What happened and what you expected instead",
  "Steps to reproduce the problem",
  "Screenshots, logs, or command output if you have them",
  "Your server, feature, or game context when relevant",
];

export default function Support() {
  return (
    <div className="w-full py-8">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.14),transparent_22%),linear-gradient(180deg,rgba(10,16,29,0.98),rgba(7,11,22,0.98))] px-5 py-8 shadow-2xl shadow-cyan-950/20 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-[-5%] top-24 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
        </div>

        <div className="relative">
          <header className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Support Center
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Choose the fastest way to get help with AstroStats
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Use GitHub Issues for tracked bugs and feature requests, use
              Discord for quick help, and email us directly for website,
              billing, or account problems.
            </p>
          </header>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/12 via-orange-400/10 to-rose-500/10 p-6 shadow-xl shadow-orange-950/20 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
                    Email Required
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Website, Stripe, or account issue?
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-amber-50/85 sm:text-base">
                    If the problem involves the website, payments, subscriptions,
                    invoices, or your account, email us at{" "}
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="font-semibold text-white underline decoration-amber-300/70 underline-offset-4"
                    >
                      {SUPPORT_EMAIL}
                    </a>
                    . Please do not post private billing or account details in
                    GitHub issues or Discord.
                  </p>
                </div>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex flex-shrink-0 items-center justify-center gap-2 self-start whitespace-nowrap rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/30 ring-1 ring-white/10 transition hover:scale-[1.01] hover:bg-slate-900 hover:shadow-xl hover:shadow-orange-950/30 sm:self-center"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7.5l7.89 5.26a2 2 0 002.22 0L21 7.5M5.25 19h13.5A2.25 2.25 0 0021 16.75v-9.5A2.25 2.25 0 0018.75 5H5.25A2.25 2.25 0 003 7.25v9.5A2.25 2.25 0 005.25 19z"
                    />
                  </svg>
                  Email Support
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {emailTopics.map((topic) => (
                  <div
                    key={topic}
                    className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-100"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                Before you send it
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                A few details help us respond faster
              </h2>
              <div className="mt-6 space-y-3">
                {issueChecklist.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {channels.map((channel) => (
              <article
                key={channel.title}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl ${channel.shadow} transition duration-300 hover:-translate-y-1 sm:p-8`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${channel.accent}`}
                />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${channel.accent}`}
                    >
                      {channel.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {channel.eyebrow}
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        {channel.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                    {channel.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {channel.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <p className="text-sm leading-6 text-slate-300">{point}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r ${channel.accent} px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 group-hover:scale-[1.01]`}
                  >
                    {channel.cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
