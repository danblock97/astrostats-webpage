import {
  createIssueInLinear,
  getBacklogStateId,
  getLinearClient,
  resolveLabelIds,
  getTeamByKey,
  listIssuesByLabel,
  listIssuesMixedFilter,
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

function getLabelsForType(baseLabel, type) {
  const labels = [baseLabel];
  if (type === "bug") {
    labels.push("Bug");
  } else if (type === "feature") {
    labels.push("Feature");
  }
  return labels;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return json(400, { error: "Invalid JSON body." });

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const priority = normalizePriority(body.priority);
    const turnstileToken = String(body.turnstileToken || "");
    const type = String(body.type || "bug").toLowerCase(); // default to bug
    const project = String(body.project || "web").toLowerCase(); // default to web

    if (!["bug", "feature"].includes(type)) {
      return json(400, { error: "Invalid type. Must be 'bug' or 'feature'." });
    }

    if (!["web", "bot"].includes(project)) {
      return json(400, { error: "Invalid project. Must be 'web' or 'bot'." });
    }

    if (!title) return json(400, { error: "Title is required." });
    if (!description) return json(400, { error: "Description is required." });

    const turnstile = await verifyTurnstileToken({ token: turnstileToken });
    if (!turnstile.ok) {
      return json(400, { error: turnstile.error || "Verification failed." });
    }

    const client = getLinearClient();
    const teamKey = process.env.LINEAR_TEAM_KEY;

    // Choose base label based on project selection
    // Fallback to Env var if needed, but per plan we use specific names
    let baseLabelName = "AstroStats Web";
    if (project === "bot") {
      baseLabelName = "AstroStats Bot";
    }

    const team = await getTeamByKey(client, teamKey);
    const labelNames = getLabelsForType(baseLabelName, type);

    // Resolve all label IDs (create if missing)
    const labelIds = await resolveLabelIds(client, {
      teamId: team.id,
      labelNames,
    });

    const backlogStateId = await getBacklogStateId(client, team.id);

    const issue = await createIssueInLinear(client, {
      teamId: team.id,
      stateId: backlogStateId,
      labelIds, // Pass array
      title,
      description,
      priority,
    });

    return json(200, { id: issue.id, identifier: issue.identifier });
  } catch (err) {
    console.error("Linear API Error:", err);
    return json(500, { error: err?.message || "Internal server error." });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limitRaw = url.searchParams.get("limit");
    const type = (url.searchParams.get("type") || "bug").toLowerCase();

    const limit = Math.min(
      Math.max(parseInt(limitRaw || "50", 10) || 50, 1),
      100
    );

    const client = getLinearClient();
    const teamKey = process.env.LINEAR_TEAM_KEY;

    // Hardcoded project labels we want to include
    const projectLabelNames = ["AstroStats Web", "AstroStats Bot"];
    // The type label (Bug or Feature)
    const typeLabelName = type === "feature" ? "Feature" : "Bug";

    const team = await getTeamByKey(client, teamKey);

    // Resolve project label IDs
    const projectLabelIds = await resolveLabelIds(client, {
      teamId: team.id,
      labelNames: projectLabelNames,
    });

    // Resolve type label ID
    const [typeLabelId] = await resolveLabelIds(client, {
      teamId: team.id,
      labelNames: [typeLabelName],
    });

    const issues = await listIssuesMixedFilter(client, {
      teamId: team.id,
      typeLabelId,
      projectLabelIds,
      first: limit,
    });

    const normalized = await Promise.all(issues.map(async (i) => {
      const labels = await i.labels().then(l => l.nodes);
      const isWeb = labels.some(l => l.name === "AstroStats Web");
      const isBot = labels.some(l => l.name === "AstroStats Bot");
      let project = "Unknown";
      if (isWeb) project = "Web";
      if (isBot) project = "Bot";

      const assignee = await i.assignee;
      const state = await i.state;

      return {
        id: i.id,
        identifier: i.identifier,
        title: i.title,
        status: state?.name || "Unknown",
        state: {
          id: state?.id,
          name: state?.name,
          color: state?.color,
          type: state?.type,
        },
        priority: i.priority ?? 0,
        updatedAt: i.updatedAt,
        project,
        assignee: assignee ? {
          id: assignee.id,
          name: assignee.name,
          avatarUrl: assignee.avatarUrl,
        } : null,
        descriptionPreview: String(i.description || "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 220),
        description: i.description || "",
      };
    }));

    return json(200, { issues: normalized });
  } catch (err) {
    console.error("Linear API Error:", err);
    return json(500, { error: err?.message || "Internal server error." });
  }
}


