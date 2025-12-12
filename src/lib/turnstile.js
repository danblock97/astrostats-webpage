const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function shouldBypassTurnstile() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.TURNSTILE_DISABLE_IN_DEV === "true"
  );
}

export async function verifyTurnstileToken({ token, ip }) {
  if (shouldBypassTurnstile()) {
    return { ok: true, bypassed: true };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return {
      ok: false,
      bypassed: false,
      error: "Missing TURNSTILE_SECRET_KEY.",
    };
  }

  if (!token) {
    return { ok: false, bypassed: false, error: "Missing Turnstile token." };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    return { ok: false, bypassed: false, error: "Turnstile verify failed." };
  }

  if (data.success) return { ok: true, bypassed: false };

  return {
    ok: false,
    bypassed: false,
    error: "Turnstile verification failed.",
    codes: data["error-codes"] || [],
  };
}


