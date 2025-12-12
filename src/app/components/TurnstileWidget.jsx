"use client";

import React, { useEffect, useRef, useState } from "react";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-api";

function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function TurnstileWidget({ onToken }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setError("");
        if (!siteKey) {
          setError("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.");
          return;
        }

        await loadTurnstileScript();
        if (cancelled) return;
        if (!containerRef.current) return;
        if (!window.turnstile) {
          setError("Turnstile failed to load.");
          return;
        }

        if (widgetIdRef.current !== null) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onToken?.(token),
          "expired-callback": () => onToken?.(""),
          "error-callback": () => onToken?.(""),
        });
        widgetIdRef.current = widgetId;
      } catch (e) {
        setError("Turnstile failed to load.");
        onToken?.("");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (typeof window !== "undefined" && window.turnstile) {
        if (widgetIdRef.current !== null) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      }
    };
  }, [siteKey, onToken]);

  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="min-h-[65px]" />;
}


