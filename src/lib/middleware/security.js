import { NextResponse } from "next/server";

// Routes that accept POST/PUT/DELETE without requiring an x-api-key header
const PUBLIC_POST_ROUTES = ["/api/support"];

/**
 * Validates the x-api-key header on mutating requests.
 * Returns a 401 NextResponse if the key is invalid, or null if the request is allowed.
 */
export function validateApiKey(request) {
  const requestUrl = new URL(request.url);

  if (
    ["POST", "PUT", "DELETE"].includes(request.method) &&
    !PUBLIC_POST_ROUTES.includes(requestUrl.pathname)
  ) {
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized", reason: "invalid_api_key" },
        { status: 401 }
      );
    }
  }

  return null;
}
