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

export async function getOrCreateLabel(client, { teamId, labelName }) {
  if (!labelName) throw new Error("Missing LINEAR_LABEL_NAME.");

  const labels = await client.issueLabels({
    first: 1,
    filter: {
      name: { eq: labelName },
      team: { id: { eq: teamId } },
    },
  });

  const existing = labels?.nodes?.[0];
  if (existing) return existing;

  const createdPayload = await client.createIssueLabel({
    name: labelName,
    teamId,
  });
  const created = await createdPayload.issueLabel;
  if (!created) throw new Error("Failed to create Linear label.");
  return created;
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
  const { teamId, stateId, labelId, title, description, priority } = input;
  const payload = await client.createIssue({
    teamId,
    stateId,
    title,
    description,
    priority: mapPriority(priority),
    labelIds: [labelId],
  });

  const issue = await payload.issue;
  if (!issue) throw new Error("Failed to create Linear issue.");
  return issue;
}

export async function listIssuesByLabel(client, { teamId, labelId, first = 50 }) {
  const query = /* GraphQL */ `
    query PublicIssues($first: Int, $filter: IssueFilter) {
      issues(first: $first, filter: $filter) {
        nodes {
          id
          identifier
          title
          description
          priority
          updatedAt
          state {
            id
            name
            type
          }
        }
      }
    }
  `;

  const variables = {
    first,
    filter: {
      team: { id: { eq: teamId } },
      labels: { some: { id: { eq: labelId } } },
    },
  };

  const data = await client.client.request(query, variables);
  const nodes = data?.issues?.nodes || [];
  return nodes;
}


