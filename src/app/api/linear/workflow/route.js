
import { getLinearClient, getTeamByKey, getWorkflowStates } from "@/lib/linear";

function json(status, body) {
    return Response.json(body, { status });
}

export async function GET(request) {
    try {
        const client = getLinearClient();
        const teamKey = process.env.LINEAR_TEAM_KEY;
        const team = await getTeamByKey(client, teamKey);
        const states = await getWorkflowStates(client, team.id);

        const simplified = states.map(s => ({
            id: s.id,
            name: s.name,
            type: s.type,
            color: s.color,
            position: s.position,
        })).sort((a, b) => a.position - b.position);

        return json(200, { states: simplified });
    } catch (err) {
        console.error("Linear Workflow API Error:", err);
        return json(500, { error: err?.message || "Internal server error." });
    }
}
