"use client";
import React, { useEffect, useMemo, useState } from "react";
import TurnstileWidget from "./TurnstileWidget";
import CustomSelect from "./CustomSelect";

const FeatureRequest = () => {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "AstroStats • Feature Request";
    }
  }, []);

  const DISCORD_SERVER_URL = "https://discord.gg/BeszQxTn9D";
  const FEATURES_PAGE_PATH = "/issues";

  const turnstileBypassInDev = useMemo(() => {
    return (
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_TURNSTILE_DISABLE_IN_DEV === "true"
    );
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("none");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(null); // { identifier }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(null);

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle) return setSubmitError("Please enter a title.");
    if (!trimmedDescription) return setSubmitError("Please enter a description.");

    if (!turnstileBypassInDev && !turnstileToken) {
      return setSubmitError("Please complete the verification to submit.");
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/linear/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          priority,
          turnstileToken: turnstileBypassInDev ? "dev-bypass" : turnstileToken,
          type: "feature",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit feature request.");
      }

      setSubmitSuccess({ identifier: data?.identifier });
      setTitle("");
      setDescription("");
      setPriority("none");
      setTurnstileToken("");
    } catch (err) {
      setSubmitError(err?.message || "Failed to submit feature request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full my-10">
      <section className="relative mx-auto max-w-5xl px-4">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute top-20 left-6 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-24 right-8 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
              Request a Feature
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#adb7be] max-w-2xl mx-auto">
            Have an idea for AstroStats? Let us know using the form below
          </p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto" />
        </header>

        {/* Feature Request Form */}
        <div className="mx-auto max-w-4xl mb-10">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />

            {/* Main card with form */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    maxLength={120}
                    placeholder="Short summary of your feature idea"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    maxLength={6000}
                    placeholder="What feature would you like to see? How would it work?"
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/60"
                    required
                  />
                  <p className="mt-2 text-xs text-white/40">
                    This creates an issue in our internal tracker with the label{" "}
                    <span className="text-white/70">Feature</span>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Priority (How important is this to you?)
                    </label>
                    <CustomSelect
                      value={priority}
                      onChange={setPriority}
                      options={[
                        { value: "none", label: "Nice to have" },
                        { value: "medium", label: "Important" },
                        { value: "high", label: "Critical" }
                      ]}
                      colorScheme="pink"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    {!turnstileBypassInDev ? (
                      <TurnstileWidget onToken={setTurnstileToken} />
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
                        Turnstile disabled in dev (feature flag).
                      </div>
                    )}
                  </div>
                </div>

                {submitError ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {submitError}
                  </div>
                ) : null}

                {submitSuccess?.identifier ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    Thanks — feature request submitted ({submitSuccess.identifier}).
                    <a
                      href={FEATURES_PAGE_PATH}
                      className="ml-2 underline underline-offset-4 text-emerald-100 hover:text-white"
                    >
                      View public requests
                    </a>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-orange-600 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit request"}
                  </button>

                  <a
                    href={FEATURES_PAGE_PATH}
                    className="text-sm text-white/60 hover:text-white underline underline-offset-4"
                  >
                    Browse public requests
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Discord CTA - Secondary */}
        <div className="mx-auto max-w-3xl mb-10">
          <div className="relative rounded-xl border border-white/10 bg-gray-900/40 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Need more help?</h3>
                  <p className="text-gray-400 text-sm">Join our Discord for community support and updates</p>
                </div>
              </div>
              <a
                href={DISCORD_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-orange-600 text-white font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/40 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureRequest;
