import { NextResponse } from "next/server";
import { getActiveBanner } from "../../../lib/banners";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // Prevent static generation
export const revalidate = 0; // Disable caching

export async function GET() {
  try {
    const banner = await getActiveBanner();
    
    return NextResponse.json(
      { banner },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { banner: null },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
