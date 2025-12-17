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

    // Filters & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'feature', 'bug'
    const [projectFilter, setProjectFilter] = useState("all"); // 'all', 'web', 'bot'

    // Sidesheet State
    const [selectedIssue, setSelectedIssue] = useState(null);

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

    const filteredIssues = issues.filter(issue => {
        // 1. Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            issue.title.toLowerCase().includes(query) ||
            issue.identifier.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // 2. Type Filter
        if (typeFilter !== "all" && issue._type !== typeFilter) return false;

        // 3. Project Filter
        if (projectFilter !== "all") {
            if (projectFilter === "web" && issue.project !== "Web") return false;
            if (projectFilter === "bot" && issue.project !== "Bot") return false;
        }

        return true;
    });

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
        <div className="flex flex-col h-[calc(100vh-100px)]">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search issues..."
                        className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-md leading-5 bg-black/20 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:border-blue-500/50 sm:text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-black/20 text-gray-300 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                    >
                        <option value="all">All Types</option>
                        <option value="feature">Features</option>
                        <option value="bug">Bugs</option>
                    </select>

                    <select
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                        className="bg-black/20 text-gray-300 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                    >
                        <option value="all">All Projects</option>
                        <option value="web">Web</option>
                        <option value="bot">Bot</option>
                    </select>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-4 pb-4 h-full">
                {columns.map(col => {
                    // Filter issues for this column using the ALREADY FILTERED list
                    const colIssues = filteredIssues.filter(i => {
                        if (i.state && i.state.id === col.id) return true;
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
                                    <div
                                        key={issue.id}
                                        onClick={() => setSelectedIssue(issue)}
                                        className="group relative p-3 rounded-lg border border-white/10 bg-[#18181b] hover:border-white/20 hover:bg-[#202023] transition-all shadow-sm cursor-pointer"
                                    >
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

            {/* Issue Details Sidesheet */}
            {selectedIssue && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedIssue(null)}
                        ></div>

                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700">
                                <div className="flex h-full flex-col overflow-y-scroll bg-[#18181b] border-l border-white/10 shadow-xl">
                                    <div className="px-4 py-6 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-medium text-white" id="slide-over-title">
                                                    {selectedIssue.identifier}
                                                </h2>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${selectedIssue._type === 'feature'
                                                    ? 'border-pink-500/30 text-pink-300 bg-pink-500/10'
                                                    : 'border-blue-500/30 text-blue-300 bg-blue-500/10'
                                                    }`}>
                                                    {selectedIssue._type === 'feature' ? 'Feature' : 'Bug'}
                                                </span>
                                            </div>
                                            <div className="ml-3 flex h-7 items-center">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-transparent text-gray-400 hover:text-white focus:outline-none"
                                                    onClick={() => setSelectedIssue(null)}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-sm text-blue-400/80">
                                                {selectedIssue.project}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        {/* Content */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white leading-snug">
                                                    {selectedIssue.title}
                                                </h3>
                                            </div>

                                            <div className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Status</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedIssue.state?.color || '#333' }} />
                                                        <span className="text-sm text-gray-300">{selectedIssue.state?.name || 'Unknown'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 pl-4 border-l border-white/5">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Priority</span>
                                                    <div className="flex items-center gap-1">
                                                        <PriorityIcon priority={selectedIssue.priority} />
                                                        <span className="text-sm text-gray-300 ml-1">
                                                            {selectedIssue.priority === 1 ? 'Urgent' :
                                                                selectedIssue.priority === 2 ? 'High' :
                                                                    selectedIssue.priority === 3 ? 'Medium' :
                                                                        selectedIssue.priority === 4 ? 'Low' : 'None'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedIssue.assignee && (
                                                <div>
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Assignee</span>
                                                    <div className="flex items-center gap-2">
                                                        {selectedIssue.assignee.avatarUrl ? (
                                                            <img src={selectedIssue.assignee.avatarUrl} alt={selectedIssue.assignee.name} className="w-6 h-6 rounded-full" />
                                                        ) : (
                                                            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">
                                                                {selectedIssue.assignee.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <span className="text-sm text-gray-300">{selectedIssue.assignee.name}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-4 border-t border-white/10">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-3">Description</span>
                                                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-sans">
                                                    {selectedIssue.description || (
                                                        <span className="italic text-gray-500">No description provided.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
