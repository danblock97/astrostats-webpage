import { NextResponse } from "next/server";

/**
 * Validates the x-api-key header on mutating requests.
 * Returns a 401 NextResponse if the key is invalid, or null if the request is allowed.
 */
export function validateApiKey(request) {
  if (
    ["POST", "PUT", "DELETE"].includes(request.method)
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
