import Support from "../components/Support";

export const metadata = {
	title: "Support - Get Help with AstroStats",
	description:
		"Get help with AstroStats, submit bug reports, request features through Jira forms, or contact the support team directly.",
	openGraph: {
		title: "Support - Get Help with AstroStats",
		description:
			"Get help with AstroStats, submit bug reports, request features through Jira forms, or contact the support team directly.",
		url: "https://astrostats.info/support",
	},
	twitter: {
		title: "Support - Get Help with AstroStats",
		description:
			"Get help with AstroStats, submit bug reports, request features through Jira forms, or contact the support team directly.",
	},
};

export default function SupportPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <div className="container mt-16 mx-auto px-6 py-8">
                <Support />
            </div>
        </main>
    );
}
