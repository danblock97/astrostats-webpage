"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

const CONSENT_COOKIE_NAME = "astrostats_cookie_consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function readConsentCookie() {
  if (typeof document === "undefined") return null;

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (cookieValue === CONSENT_ACCEPTED || cookieValue === CONSENT_REJECTED) {
    return cookieValue;
  }

  return null;
}

function persistConsentCookie(value) {
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Max-Age=${ONE_YEAR_IN_SECONDS}; Path=/; SameSite=Lax`;
}

export default function AnalyticsConsent({ gaId }) {
  const [consent, setConsent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setConsent(readConsentCookie());
    setIsReady(true);
  }, []);

  function handleConsent(value) {
    persistConsentCookie(value);
    setConsent(value);
  }

  if (!gaId) return null;

  const shouldShowBanner = isReady && !consent;
  const shouldLoadAnalytics = consent === CONSENT_ACCEPTED;

  return (
    <>
      {shouldShowBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#121212]/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-[#121212]/80">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Cookie consent
                </p>
                <p className="mt-1 text-sm text-[#adb7be]">
                  We use Google Analytics cookies to measure site traffic and
                  page views. You can accept or decline non-essential cookies.
                  Read more in our{" "}
                  <Link
                    href="/legal/privacy-policy"
                    className="text-white underline underline-offset-2 hover:text-[#adb7be]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleConsent(CONSENT_REJECTED)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[#adb7be] transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent(CONSENT_ACCEPTED)}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {shouldLoadAnalytics ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
