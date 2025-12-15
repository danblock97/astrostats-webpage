"use client";

import React, { useEffect, useMemo, useState } from "react";

function priorityLabel(priority) {
    switch (priority) {
        case 1:
            return "Critical"; // or "Urgent" depending on pref
        case 2:
            return "High";
        case 3:
            return "Normal";
        case 4:
            return "Low";
        case 0:
        default:
            return "None";
    }
}

export default function IssueList({ type }) {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const effectiveType = type || "bug";
    const title = effectiveType === "feature" ? "Public Feature Requests" : "Public Bug Reports";
    const subtitle = effectiveType === "feature"
        ? "Features requested by the community."
        : "Bugs tracked for AstroStats Web (all statuses).";

    const gradientClass = effectiveType === "feature"
        ? "from-pink-500 to-orange-500"
        : "from-blue-600 to-violet-600";

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(`/api/linear/issues?limit=100&type=${effectiveType}`);
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || "Failed to load items.");
                if (!cancelled) setIssues(Array.isArray(data?.issues) ? data.issues : []);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Failed to load items.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [effectiveType]);

    const sorted = useMemo(() => {
        return [...issues].sort((a, b) => {
            const at = new Date(a.updatedAt).getTime() || 0;
            const bt = new Date(b.updatedAt).getTime() || 0;
            return bt - at; // Newest first
        });
    }, [issues]);

    return (
        <div className="w-full my-10" id="issues">
            <section className="relative mx-auto max-w-6xl px-4">
                <header className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}`}>
                            {title}
                        </span>
                    </h2>
                    <p className="mt-4 text-base text-[#adb7be] max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                    <div className={`mt-4 h-1 w-24 bg-gradient-to-r ${gradientClass} rounded-full mx-auto`} />
                </header>

                {error ? (
                    <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                        {error}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-gray-900/40 px-6 py-8 text-white/70">
                        Loading...
                    </div>
                ) : null}

                {!isLoading && !error ? (
                    <div className="mx-auto max-w-6xl">
                        {sorted.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-gray-900/40 px-6 py-8 text-white/70">
                                No items found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/60">
                                <table className="min-w-[900px] w-full text-left">
                                    <thead className="bg-black/30">
                                        <tr className="text-xs text-white/60">
                                            <th className="px-4 py-3 font-medium">ID</th>
                                            <th className="px-4 py-3 font-medium">Project</th>
                                            <th className="px-4 py-3 font-medium">Title</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Priority</th>
                                            <th className="px-4 py-3 font-medium">Updated</th>
                                            <th className="px-4 py-3 font-medium">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {sorted.map((issue) => (
                                            <tr
                                                key={issue.id}
                                                className="text-sm text-white/80 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-white/70">
                                                    {issue.identifier}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${issue.project === "Bot"
                                                            ? "border-purple-500/30 bg-purple-500/10 text-purple-200"
                                                            : "border-blue-500/30 bg-blue-500/10 text-blue-200"
                                                        }`}>
                                                        {issue.project || "Web"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 min-w-[260px]">
                                                    <div className="font-medium text-white">
                                                        {issue.title}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/80">
                                                        {issue.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/80">
                                                        {priorityLabel(issue.priority)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-white/60">
                                                    {issue.updatedAt
                                                        ? new Date(issue.updatedAt).toLocaleString()
                                                        : "—"}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-white/60">
                                                    {issue.descriptionPreview || "—"}
                                                    {issue.descriptionPreview?.length >= 220 ? "…" : ""}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : null}
            </section>
        </div>
    );
}
