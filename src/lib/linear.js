import { LinearClient } from "@linear/sdk";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing ${name}.`);
  }
  return v;
}

export function getLinearClient() {
  const apiKey = requireEnv("LINEAR_API_KEY");
  return new LinearClient({ apiKey });
}

export function mapPriority(priority) {
  switch (priority) {
    case "urgent":
      return 1;
    case "high":
      return 2;
    case "medium":
      return 3; // Linear calls this "Normal" by default.
    case "low":
      return 4;
    case "none":
    default:
      return 0;
  }
}

export async function getTeamByKey(client, teamKey) {
  if (!teamKey) throw new Error("Missing LINEAR_TEAM_KEY.");
  const teams = await client.teams({
    first: 1,
    filter: { key: { eq: teamKey } },
  });
  const team = teams?.nodes?.[0];
  if (!team) throw new Error(`Linear team not found for key "${teamKey}".`);
  return team;
}

/**
 * Resolves a list of label names to their IDs.
 * Creates them if they don't exist.
 */
export async function resolveLabelIds(client, { teamId, labelNames = [] }) {
  if (!labelNames.length) return [];

  // 1. Fetch existing labels for this team
  const existingLabelsNodes = await client.issueLabels({
    first: 100, // naive max, usually enough
    filter: {
      team: { id: { eq: teamId } },
      name: { in: labelNames },
    },
  });
  const existingLabels = existingLabelsNodes?.nodes || [];

  const resolvedIds = [];

  for (const name of labelNames) {
    const match = existingLabels.find((l) => l.name === name);
    if (match) {
      resolvedIds.push(match.id);
    } else {
      // Create it
      const createdPayload = await client.createIssueLabel({
        name,
        teamId,
      });
      const created = await createdPayload.issueLabel;
      if (!created) {
        console.warn(`Failed to create Linear label: ${name}`);
        continue;
      }
      resolvedIds.push(created.id);
    }
  }

  return resolvedIds;
}

export async function getBacklogStateId(client, teamId) {
  const team = await client.team(teamId);
  const statesConn = await team.states({ first: 50 });
  const states = statesConn?.nodes || [];

  const backlog =
    states.find((s) => String(s?.type).toLowerCase() === "backlog") ||
    states.find((s) => String(s?.name).toLowerCase() === "backlog");

  if (!backlog?.id) {
    throw new Error('Backlog workflow state not found for team (type "backlog" or name "Backlog").');
  }

  return backlog.id;
}

export async function createIssueInLinear(client, input) {
  const { teamId, stateId, labelIds, title, description, priority } = input;
  const payload = await client.createIssue({
    teamId,
    stateId,
    title,
    description,
    priority: mapPriority(priority),
    labelIds: labelIds || [],
  });

  const issue = await payload.issue;
  if (!issue) throw new Error("Failed to create Linear issue.");
  return issue;
}

export async function listIssuesByLabel(client, { teamId, labelIds, first = 50 }) {
  // If no labels provided, return no issues (strict filtering)
  if (!labelIds || labelIds.length === 0) {
    return [];
  }

  // Linear API "labels" filter uses logical OR by default if you pass an array.
  // To get logical AND (must have ALL labels), we have to be trickier or filter client-side.
  // However, the standard `filter` object allows `labels: { some: ... }` or `and: [...]`.
  // Let's try constructing an `and` filter for labels.

  const labelFilters = labelIds.map((id) => ({
    labels: { some: { id: { eq: id } } },
  }));

  const filter = {
    team: { id: { eq: teamId } },
    and: labelFilters,
  };

  const issues = await client.issues({
    first,
    filter,
  });

  return issues?.nodes || [];
}


export async function listIssuesMixedFilter(client, { teamId, typeLabelId, projectLabelIds, first = 50 }) {
  if (!typeLabelId) return [];
  if (!projectLabelIds || projectLabelIds.length === 0) return [];

  // We want issues that have the Type label AND (ProjectLabel A OR ProjectLabel B ...).
  const projectOrFilters = projectLabelIds.map((id) => ({
    labels: { some: { id: { eq: id } } },
  }));

  const filter = {
    team: { id: { eq: teamId } },
    and: [
      { labels: { some: { id: { eq: typeLabelId } } } },
      { or: projectOrFilters },
    ],
  };

  const issues = await client.issues({
    first,
    filter,
  });

  return issues?.nodes || [];
}

export async function getWorkflowStates(client, teamId) {
  const team = await client.team(teamId);
  const statesConn = await team.states({ first: 50 });
  return statesConn?.nodes || [];
}
