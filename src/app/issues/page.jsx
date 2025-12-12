"use client";

import React, { useEffect, useMemo, useState } from "react";

function priorityLabel(priority) {
  switch (priority) {
    case 1:
      return "Urgent";
    case 2:
      return "High";
    case 3:
      return "Medium";
    case 4:
      return "Low";
    case 0:
    default:
      return "No priority";
  }
}

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch("/api/linear/issues?limit=100");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load issues.");
        if (!cancelled) setIssues(Array.isArray(data?.issues) ? data.issues : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load issues.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...issues].sort((a, b) => {
      const at = new Date(a.updatedAt).getTime() || 0;
      const bt = new Date(b.updatedAt).getTime() || 0;
      return bt - at;
    });
  }, [issues]);

  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <div className="w-full mt-24 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
        <div className="w-full my-10">
          <section className="relative mx-auto max-w-6xl px-4">
            <div className="pointer-events-none absolute -z-10 inset-0">
              <div className="absolute top-20 left-6 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-24 right-8 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
            </div>

            <header className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-extrabold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                  Public Issues
                </span>
              </h1>
              <p className="mt-4 text-lg text-[#adb7be] max-w-2xl mx-auto">
                Issues tracked for AstroStats Web (all statuses).
              </p>
              <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto" />
            </header>

            {error ? (
              <div className="mx-auto max-w-6xl rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-gray-900/40 px-6 py-8 text-white/70">
                Loading issues…
              </div>
            ) : null}

            {!isLoading && !error ? (
              <div className="mx-auto max-w-6xl">
                {sorted.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-gray-900/40 px-6 py-8 text-white/70">
                    No issues found.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/90 to-gray-800/60">
                    <table className="min-w-[900px] w-full text-left">
                      <thead className="bg-black/30">
                        <tr className="text-xs text-white/60">
                          <th className="px-4 py-3 font-medium">ID</th>
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
      </div>
    </main>
  );
}


