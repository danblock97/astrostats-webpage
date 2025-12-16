"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// Helper to determine priority icons/labels
const PriorityIcon = ({ priority }) => {
    // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
    // Matching the Linear style from the user image
    // 0: ...
    // 1: [!] box
    // 2: 3 bars
    // 3: 2 bars
    // 4: 1 bar

    if (priority === 1) {
        return (
            <div title="Urgent" className="flex items-center justify-center w-5 h-5 rounded bg-red-900/40 border border-red-700/50">
                <svg className="w-3.5 h-3.5 text-red-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>
        );
    }
    if (priority === 2) {
        return (
            <div title="High" className="flex items-end gap-0.5 w-4 h-4 ml-0.5">
                <div className="w-1 h-1.5 bg-orange-400 rounded-sm"></div>
                <div className="w-1 h-3 bg-orange-400 rounded-sm"></div>
                <div className="w-1 h-4 bg-orange-400 rounded-sm"></div>
            </div>
        );
    }
    if (priority === 3) {
        return (
            <div title="Medium" className="flex items-end gap-0.5 w-4 h-4 ml-0.5">
                <div className="w-1 h-1.5 bg-yellow-400 rounded-sm"></div>
                <div className="w-1 h-3 bg-yellow-400 rounded-sm"></div>
                <div className="w-1 h-4 bg-gray-600 rounded-sm"></div>
            </div>
        );
    }
    if (priority === 4) {
        return (
            <div title="Low" className="flex items-end gap-0.5 w-4 h-4 ml-0.5">
                <div className="w-1 h-1.5 bg-blue-400 rounded-sm"></div>
                <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
                <div className="w-1 h-4 bg-gray-600 rounded-sm"></div>
            </div>
        );
    }

    // No priority
    return (
        <div title="No priority" className="flex items-center justify-center w-4 h-4 ml-0.5">
            <span className="text-gray-400 font-bold leading-none mb-1">...</span>
        </div>
    );
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState([]);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [wfRes, issuesRes] = await Promise.all([
                    fetch("/api/linear/workflow"),
                    fetch("/api/linear/issues?limit=100&type=bug") // Fetch bugs first, or maybe both? 
                    // Implementation plan said "move public issues for bugs and features into one /issues page"
                    // API supports one type at a time or mixed? 
                    // Checked API: It filters by type=bug OR type=feature. 
                    // Wait, logic says "type === 'feature' ? 'Feature' : 'Bug'".
                    // It seems it only fetches ONE type.
                    // BUT `listIssuesMixedFilter` implies mixed filtering logic?
                    // Let's check `listIssuesMixedFilter` usage in GET issues again.
                    // It takes `typeLabelId`.
                    // We might need to adjust API to fetch *all* public issues (both bug and feature) or just bugs?
                    // User request: "move the public issues for bugs and features into one /issues page"
                    // So we want ALL.
                ]);

                // Actually I need to fetch BOTH bugs and features. 
                // Or update API to allow fetching both.
                // For now, let's fetch both in parallel and merge content if API limits it.
                // Re-reading API code: `const type = (url.searchParams.get("type") || "bug")`
                // It strictly picks one type label.
                // I should probably fetch 'bug' and 'feature' separately on client and merge.
            } catch (e) {
                console.error(e);
            }
        }
        // fetchData(); 
        // Wait, I will write the implementation inside the component to fetch both.
    }, []);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                // 1. Fetch Workflow States
                const wfRes = await fetch("/api/linear/workflow");
                const wfData = await wfRes.json();
                if (!wfRes.ok) throw new Error(wfData.error || "Failed to load workflow");

                // 2. Fetch Issues (Bugs AND Features)
                // We'll run two requests in parallel
                const [bugsRes, featuresRes] = await Promise.all([
                    fetch("/api/linear/issues?limit=50&type=bug"),
                    fetch("/api/linear/issues?limit=50&type=feature"),
                ]);

                const bugsData = await bugsRes.json();
                const featuresData = await featuresRes.json();

                const bugsWithTag = (bugsData.issues || []).map(i => ({ ...i, _type: 'bug' }));
                const featuresWithTag = (featuresData.issues || []).map(i => ({ ...i, _type: 'feature' }));

                const allIssues = [
                    ...bugsWithTag,
                    ...featuresWithTag
                ];

                // Deduplicate just in case? (Unlikely unless issue has both labels)
                // Sort by priority or updated?
                // Let's sort by updated
                allIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                const sortOrder = [
                    "backlog",
                    "to do",
                    "todo", // Handle "Todo" without space
                    "in progress",
                    "in review",
                    "done",
                    "canceled",
                    "cancelled", // handle spelling variations
                    "duplicate"
                ];

                const sortedCols = (wfData.states || []).sort((a, b) => {
                    const idxA = sortOrder.indexOf(a.name.toLowerCase());
                    const idxB = sortOrder.indexOf(b.name.toLowerCase());

                    // If both are in the known list, sort by index
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;

                    // If A is known but B is not, A comes first
                    if (idxA !== -1) return -1;

                    // If B is known but A is not, B comes first
                    if (idxB !== -1) return 1;

                    // Fallback to position sort (already sorted by API but good to depend on)
                    return a.position - b.position;
                });

                setColumns(sortedCols);
                setIssues(allIssues);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-400 text-center p-8">Error: {error}</div>;
    }

    return (
        <div className="flex overflow-x-auto gap-4 pb-4 min-h-[calc(100vh-200px)]">
            {columns.map(col => {
                // Filter issues for this column
                const colIssues = issues.filter(i => {
                    // Check matching state ID or logic
                    // API returns issue.state.id
                    if (i.state && i.state.id === col.id) return true;
                    // Fallback for name matching if needed? API should be consistent now.
                    return false;
                });

                // Skip fully empty columns? Or keep them? User said "getting all workspace columns".
                // Usually we keep them.

                return (
                    <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-gray-900/30 rounded-xl border border-white/5 h-full">
                        <div className="p-3 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#121212]/90 backdrop-blur rounded-t-xl z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
                                <span className="font-semibold text-gray-200 text-sm">{col.name}</span>
                                <span className="text-gray-500 text-xs">{colIssues.length}</span>
                            </div>
                        </div>

                        <div className="p-2 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {colIssues.map(issue => (
                                <div key={issue.id} className="group relative p-3 rounded-lg border border-white/10 bg-[#18181b] hover:border-white/20 hover:bg-[#202023] transition-all shadow-sm">
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-500">{issue.identifier}</span>
                                        {issue.assignee && (
                                            <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/10" title={`Assigned to ${issue.assignee.name}`}>
                                                {issue.assignee.avatarUrl ? (
                                                    <img src={issue.assignee.avatarUrl} alt={issue.assignee.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-[8px]">{issue.assignee.name.charAt(0)}</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-medium text-gray-200 line-clamp-2 mb-2 group-hover:text-white transition-colors">
                                        {issue.title}
                                    </h4>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <PriorityIcon priority={issue.priority} />
                                            {/* Label for Bug/Feature */}
                                            {/* We can guess based on labels or if we stored it? */}
                                            {/* API `issues` return object doesn't explicitly have 'type' field but 'project' field. */}
                                            {/* We can infer type from checking if it was in bugs or features list if we stored that, or just generic tag? */}
                                            {/* The user requested "label so the user knows whats a bug and whats a feature". */}
                                            {/* I should probably add `type: 'bug' | 'feature'` to the normalized issue response in API. */}
                                            {/* I forgot to do that in API step. I can guess client side? */}
                                            {/* Or I can just render "Bug" or "Feature" based on some logic. 
                                 However, API normalized response has `project` (Web/Bot) but not Type.
                                 Let's add a badge. I can check the issue data from the `Promise.all` separation.
                             */}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                // HACK: I need to know if it's bug or feature. 
                                                // I'll attach it in the map before setting state.
                                                issue._type === 'feature'
                                                    ? 'border-pink-500/30 text-pink-300 bg-pink-500/10'
                                                    : 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                                                }`}>
                                                {issue._type === 'feature' ? 'Feature' : 'Bug'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
