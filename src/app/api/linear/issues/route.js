import {
  createIssueInLinear,
  getBacklogStateId,
  getLinearClient,
  getOrCreateLabel,
  getTeamByKey,
  listIssuesByLabel,
} from "@/lib/linear";
import { verifyTurnstileToken } from "@/lib/turnstile";

function json(status, body) {
  return Response.json(body, { status });
}

function normalizePriority(p) {
  const v = String(p || "none").toLowerCase();
  if (["none", "urgent", "high", "medium", "low"].includes(v)) return v;
  return "none";
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return json(400, { error: "Invalid JSON body." });

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const priority = normalizePriority(body.priority);
    const turnstileToken = String(body.turnstileToken || "");

    if (!title) return json(400, { error: "Title is required." });
    if (!description) return json(400, { error: "Description is required." });

    const turnstile = await verifyTurnstileToken({ token: turnstileToken });
    if (!turnstile.ok) {
      return json(400, { error: turnstile.error || "Verification failed." });
    }

    const client = getLinearClient();
    const teamKey = process.env.LINEAR_TEAM_KEY;
    const labelName = process.env.LINEAR_LABEL_NAME;

    const team = await getTeamByKey(client, teamKey);
    const label = await getOrCreateLabel(client, {
      teamId: team.id,
      labelName,
    });
    const backlogStateId = await getBacklogStateId(client, team.id);

    const issue = await createIssueInLinear(client, {
      teamId: team.id,
      stateId: backlogStateId,
      labelId: label.id,
      title,
      description,
      priority,
    });

    return json(200, { id: issue.id, identifier: issue.identifier });
  } catch (err) {
    return json(500, { error: err?.message || "Internal server error." });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limitRaw = url.searchParams.get("limit");
    const limit = Math.min(
      Math.max(parseInt(limitRaw || "50", 10) || 50, 1),
      100
    );

    const client = getLinearClient();
    const teamKey = process.env.LINEAR_TEAM_KEY;
    const labelName = process.env.LINEAR_LABEL_NAME;

    const team = await getTeamByKey(client, teamKey);
    const label = await getOrCreateLabel(client, {
      teamId: team.id,
      labelName,
    });

    const issues = await listIssuesByLabel(client, {
      teamId: team.id,
      labelId: label.id,
      first: limit,
    });

    const normalized = issues.map((i) => ({
      id: i.id,
      identifier: i.identifier,
      title: i.title,
      status: i.state?.name || "Unknown",
      priority: i.priority ?? 0,
      updatedAt: i.updatedAt,
      descriptionPreview: String(i.description || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 220),
    }));

    return json(200, { issues: normalized });
  } catch (err) {
    return json(500, { error: err?.message || "Internal server error." });
  }
}


