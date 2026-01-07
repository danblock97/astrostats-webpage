import { getDb } from "./mongo";

const COLLECTION_NAME = "banners";

async function getBannersCollection() {
  const db = await getDb();
  return db.collection(COLLECTION_NAME);
}

/**
 * Finds the most recent enabled banner or outage notice and normalizes it for UI use.
 * Returns null if nothing should be shown.
 */
export async function getActiveBanner() {
  const collection = await getBannersCollection();
  const banner = await collection.findOne(
    { is_enabled: true },
    { sort: { _id: -1 } }
  );

  if (!banner || !banner.content?.trim()) {
    return null;
  }

  const sanitizedContent = banner.content.trim();
  const requestedType = typeof banner.type === "string" ? banner.type.toLowerCase() : "";
  const bannerType =
    requestedType === "outage"
      ? "outage"
      : requestedType === "warning" || requestedType === "maintenance"
      ? "warning"
      : requestedType === "feature"
      ? "feature"
      : "feature";

  return {
    content: sanitizedContent,
    type: bannerType,
  };
}
