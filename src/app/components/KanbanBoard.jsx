"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// Helper to determine priority icons/labels
const PriorityIcon = ({ priority }) => {
    // 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low
    if (priority === 1) {
        return (
            <div title="Urgent" className="flex items-center justify-center w-5 h-5 rounded bg-red-900/40 border border-red-700/50">
                <svg className="w-3.5 h-3.5 text-red-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            </div>
        );
    }

    // Bar indicators as seen in screenshot
    return (
        <div className="flex items-end gap-[2px] h-3.5" title={priority === 2 ? "High" : priority === 3 ? "Medium" : priority === 4 ? "Low" : "No Priority"}>
            <div className={`w-[3px] rounded-full ${priority > 0 && priority <= 4 ? (priority === 2 ? 'h-full bg-gray-400' : priority === 3 ? 'h-2/3 bg-gray-400' : 'h-1/3 bg-gray-400') : 'h-1/3 bg-gray-600'}`} />
            <div className={`w-[3px] rounded-full ${priority > 0 && priority <= 3 ? (priority === 2 ? 'h-full bg-gray-400' : 'h-2/3 bg-gray-400') : 'h-[0px]'} ${priority === 4 ? 'h-1/3 bg-gray-600' : ''}`} />
            <div className={`w-[3px] rounded-full ${priority === 2 ? 'h-full bg-gray-400' : 'h-[0px]'} ${priority === 3 ? 'h-2/3 bg-gray-600' : ''} ${priority === 4 ? 'h-1/3 bg-gray-600' : ''}`} />
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
    const [typeFilter, setTypeFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");

    // Sidesheet State
    const [selectedIssue, setSelectedIssue] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                const wfRes = await fetch("/api/linear/workflow");
                const wfData = await wfRes.json();
                if (!wfRes.ok) throw new Error(wfData.error || "Failed to load workflow");

                const [bugsRes, featuresRes] = await Promise.all([
                    fetch("/api/linear/issues?limit=50&type=bug"),
                    fetch("/api/linear/issues?limit=50&type=feature"),
                ]);

                const bugsData = await bugsRes.json();
                const featuresData = await featuresRes.json();

                const bugsWithTag = (bugsData.issues || []).map(i => ({ ...i, _type: 'bug' }));
                const featuresWithTag = (featuresData.issues || []).map(i => ({ ...i, _type: 'feature' }));

                const allIssues = [...bugsWithTag, ...featuresWithTag];
                allIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                const sortOrder = ["backlog", "to do", "todo", "in progress", "in review", "done", "canceled", "cancelled", "duplicate"];

                const sortedCols = (wfData.states || []).sort((a, b) => {
                    const idxA = sortOrder.indexOf(a.name.toLowerCase());
                    const idxB = sortOrder.indexOf(b.name.toLowerCase());
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
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
        const query = searchQuery.toLowerCase();
        const matchesSearch = issue.title.toLowerCase().includes(query) || issue.identifier.toLowerCase().includes(query);
        if (!matchesSearch) return false;
        if (typeFilter !== "all" && issue._type !== typeFilter) return false;
        if (projectFilter !== "all") {
            if (projectFilter === "web" && issue.project !== "Web") return false;
            if (projectFilter === "app" && issue.project !== "Bot") return false;
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
        <div className="flex flex-col h-full bg-[#121212]">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-6 w-full max-w-4xl">
                    {/* Search */}
                    <div className="relative group flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="block w-full pl-10 pr-4 py-2 border border-white/5 rounded-lg bg-[#1a1a1a]/50 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:bg-[#1a1a1a] transition-all sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 p-1 bg-[#1a1a1a]/40 rounded-lg border border-white/5">
                        <button
                            onClick={() => setProjectFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${projectFilter === 'all' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >All</button>
                        <button
                            onClick={() => setProjectFilter('web')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${projectFilter === 'web' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >Web</button>
                        <button
                            onClick={() => setProjectFilter('app')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${projectFilter === 'app' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >App</button>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-[#1a1a1a]/40 rounded-lg border border-white/5">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${typeFilter === 'all' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >All</button>
                        <button
                            onClick={() => setTypeFilter('bug')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${typeFilter === 'bug' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >Bug</button>
                        <button
                            onClick={() => setTypeFilter('feature')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${typeFilter === 'feature' ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >Feat</button>
                    </div>
                </div>

                <a
                    href="/support"
                    className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-500/10 transition-all"
                >
                    Report an Issue
                </a>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-8 h-full scrollbar-hidden">
                {columns.map(col => {
                    const colIssues = filteredIssues.filter(i => i.state?.id === col.id);
                    if (colIssues.length === 0 && (col.name.toLowerCase() === 'duplicate' || col.name.toLowerCase() === 'canceled')) return null;

                    return (
                        <div key={col.id} className="flex-shrink-0 w-[300px] flex flex-col min-h-[500px]">
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                                <span className="font-bold text-gray-200 text-sm tracking-tight">{col.name}</span>
                                <span className="text-gray-600 text-[13px] font-medium ml-1">{colIssues.length}</span>
                            </div>

                            <div className="flex-1 space-y-4">
                                {colIssues.length === 0 ? (
                                    <div className="h-24 rounded-xl border border-dashed border-white/5 flex items-center justify-center">
                                        <span className="text-gray-700 text-xs font-medium">No issues</span>
                                    </div>
                                ) : (
                                    colIssues.map(issue => (
                                        <div
                                            key={issue.id}
                                            onClick={() => setSelectedIssue(issue)}
                                            className="group relative p-4 rounded-xl border border-white/5 bg-[#1a1a1a]/40 hover:bg-[#1a1a1a] hover:border-white/10 transition-all cursor-pointer shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[11px] font-bold text-gray-600 tracking-wider font-mono">{issue.identifier}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <PriorityIcon priority={issue.priority} />
                                                    {issue.assignee && (
                                                        <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/10 bg-gray-800">
                                                            {issue.assignee.avatarUrl ? (
                                                                <img src={issue.assignee.avatarUrl} alt={issue.assignee.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[7px] text-gray-400">{issue.assignee.name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <h4 className="text-[15px] font-bold text-gray-200 leading-tight mb-2 group-hover:text-white transition-colors line-clamp-2">
                                                {issue.title}
                                            </h4>

                                            <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                                {issue.descriptionPreview || issue.title}
                                            </p>

                                            <div className="flex items-center flex-wrap gap-2 mb-3">
                                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${issue._type === 'feature'
                                                        ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                                                        : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                                                    }`}>
                                                    <span className={`w-1 h-1 rounded-full ${issue._type === 'feature' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    {issue._type === 'feature' ? 'Feature' : 'Bug'}
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-blue-500/20 text-blue-400 bg-blue-500/5">
                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                    {issue.project === 'Web' ? 'Web' : 'App'}
                                                </span>
                                            </div>

                                            <div className="text-[10px] text-gray-600 font-medium">
                                                Updated {new Date(issue.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Issue Details Sidesheet - Kept similar functional logic but updated styles */}
            {selectedIssue && (
                <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedIssue(null)}></div>
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="pointer-events-auto w-screen max-w-xl transform transition duration-500 ease-in-out sm:duration-700">
                                <div className="flex h-full flex-col overflow-y-scroll bg-[#121212] border-l border-white/10 shadow-2xl">
                                    <div className="sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10 px-6 py-6 border-b border-white/5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-gray-500 font-bold">{selectedIssue.identifier}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${selectedIssue._type === 'feature'
                                                        ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                                                        : 'border-rose-500/20 text-rose-400 bg-rose-500/5'
                                                        }`}>
                                                        {selectedIssue._type === 'feature' ? 'Feature' : 'Bug'}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-white mt-2 leading-tight" id="slide-over-title">
                                                    {selectedIssue.title}
                                                </h2>
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-lg bg-white/5 p-2 text-gray-400 hover:text-white transition-all"
                                                onClick={() => setSelectedIssue(null)}
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-8 space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-white/5">
                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Status</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedIssue.state?.color || '#333' }} />
                                                    <span className="text-sm font-bold text-gray-200">{selectedIssue.state?.name || 'Unknown'}</span>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-[#1a1a1a]/40 border border-white/5">
                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-1.5">Priority</span>
                                                <div className="flex items-center gap-2">
                                                    <PriorityIcon priority={selectedIssue.priority} />
                                                    <span className="text-sm font-bold text-gray-200 ml-1">
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
                                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-3">Assignee</span>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a1a]/40 border border-white/5">
                                                    {selectedIssue.assignee.avatarUrl ? (
                                                        <img src={selectedIssue.assignee.avatarUrl} alt={selectedIssue.assignee.name} className="w-8 h-8 rounded-full bg-gray-800" />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                                            {selectedIssue.assignee.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-bold text-gray-200">{selectedIssue.assignee.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-6 border-t border-white/5">
                                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-4">Description</span>
                                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                                {selectedIssue.description || (
                                                    <span className="italic text-gray-600">No description provided.</span>
                                                )}
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
