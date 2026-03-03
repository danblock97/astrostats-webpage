import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LINEAR_API_URL = "https://api.linear.app/graphql";

// Priority mapping: user-facing label -> Linear priority number
const PRIORITY_MAP = {
  Low: 4,
  Medium: 3,
  High: 2,
  Critical: 1,
};

// Category -> label slug mapping
function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function linearQuery(query, variables = {}) {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) throw new Error("LINEAR_API_KEY is not configured");

  const response = await fetch(LINEAR_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Personal API keys (lin_api_...) do NOT use "Bearer" prefix
      Authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after") || "60";
    const error = new Error("Linear API rate limit exceeded");
    error.status = 429;
    error.retryAfter = parseInt(retryAfter, 10);
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

async function getTeamId(teamName) {
  const data = await linearQuery(`
    query {
      teams {
        nodes { id name }
      }
    }
  `);
  const team = data.teams.nodes.find(
    (t) => t.name.toLowerCase() === teamName.toLowerCase()
  );
  if (!team) {
    throw new Error(
      `Linear team "${teamName}" not found. Available: ${data.teams.nodes.map((t) => t.name).join(", ")}`
    );
  }
  return team.id;
}

async function ensureLabel(teamId, labelName) {
  // Fetch existing labels for this team
  const data = await linearQuery(
    `
    query ($teamId: ID!) {
      issueLabels(filter: { team: { id: { eq: $teamId } } }) {
        nodes { id name }
      }
    }
  `,
    { teamId }
  );

  const existing = data.issueLabels.nodes.find(
    (l) => l.name.toLowerCase() === labelName.toLowerCase()
  );
  if (existing) return existing.id;

  // Create the label
  const created = await linearQuery(
    `
    mutation ($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) {
        issueLabel { id name }
      }
    }
  `,
    { input: { name: labelName, teamId, color: "#6366F1" } }
  );

  return created.issueLabelCreate.issueLabel.id;
}

async function createLinearIssue({ teamId, title, description, priority, labelIds }) {
  const data = await linearQuery(
    `
    mutation ($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier url title }
      }
    }
  `,
    {
      input: {
        teamId,
        title,
        description,
        priority,
        labelIds,
      },
    }
  );

  if (!data.issueCreate.success) {
    throw new Error("Linear issueCreate returned success: false");
  }

  return data.issueCreate.issue;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    name,
    email,
    subject,
    category,
    priority,
    description,
    stepsToReproduce,
    affectedProduct,
    systemInfo,
  } = body;

  // --- Validation ---
  const missing = [];
  if (!name?.trim()) missing.push("name");
  if (!email?.trim()) missing.push("email");
  if (!subject?.trim()) missing.push("subject");
  if (!category) missing.push("category");
  if (!priority) missing.push("priority");
  if (!description?.trim()) missing.push("description");
  if (!affectedProduct) missing.push("affectedProduct");

  if (missing.length) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (description.trim().length < 20) {
    return NextResponse.json(
      { error: "Description must be at least 20 characters" },
      { status: 400 }
    );
  }

  const linearPriority = PRIORITY_MAP[priority];
  if (!linearPriority) {
    return NextResponse.json({ error: "Invalid priority value" }, { status: 400 });
  }

  const timestamp = new Date().toISOString();

  // Build markdown description
  const issueDescription = [
    `**Submitted by:** ${name} (${email})`,
    `**Category:** ${category}`,
    `**Priority:** ${priority}`,
    `**Affected Product/Feature:** ${affectedProduct}`,
    ``,
    `## Description`,
    description.trim(),
    stepsToReproduce?.trim()
      ? `\n## Steps to Reproduce\n${stepsToReproduce.trim()}`
      : null,
    ``,
    `---`,
    `**System Info:** ${systemInfo || "Not provided"}`,
    `**Submitted:** ${timestamp}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const issueTitle = `[${category}] ${subject.trim()}`;

  try {
    const teamName = process.env.LINEAR_TEAM_NAME;
    if (!teamName) throw new Error("LINEAR_TEAM_NAME is not configured");

    const teamId = await getTeamId(teamName);

    // Ensure the category label exists (create if missing)
    const categoryLabelId = await ensureLabel(teamId, categoryToSlug(category));

    const issue = await createLinearIssue({
      teamId,
      title: issueTitle,
      description: issueDescription,
      priority: linearPriority,
      labelIds: [categoryLabelId],
    });

    return NextResponse.json({
      success: true,
      issueId: issue.identifier,
      issueUrl: issue.url,
      timestamp,
    });
  } catch (err) {
    if (err.status === 429) {
      return NextResponse.json(
        {
          error: "Service temporarily unavailable. Please try again shortly.",
          retryAfter: err.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(err.retryAfter) },
        }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit support request. Please try again or contact us via email." },
      { status: 500 }
    );
  }
}
