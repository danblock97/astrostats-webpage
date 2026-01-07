import KanbanBoard from "../components/KanbanBoard";

export const metadata = {
	title: "Public Roadmap - AstroStats Development Status",
	description:
		"See what we're building, what's coming next, and the status of known issues. Track AstroStats development progress and upcoming features.",
	openGraph: {
		title: "Public Roadmap - AstroStats Development Status",
		description:
			"See what we're building, what's coming next, and the status of known issues. Track AstroStats development progress.",
		url: "https://astrostats.info/issues",
	},
	twitter: {
		title: "Public Roadmap - AstroStats Development Status",
		description:
			"See what we're building, what's coming next, and the status of known issues. Track AstroStats development progress.",
	},
};

export default function IssuesPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <div className="w-full px-6 py-8">
                <div className="mb-10 px-2">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Public Roadmap</h1>
                    <p className="text-gray-300 text-lg">See what we're building, what's coming next, and the status of known issues.</p>
                </div>
                <KanbanBoard />
            </div>
        </main>
    );
}
