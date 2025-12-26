import Support from "../components/Support";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
	title: "Support - Get Help with AstroStats",
	description:
		"Get help and support for AstroStats Discord bot. Find answers to common questions, report issues, or contact our support team.",
	openGraph: {
		title: "Support - Get Help with AstroStats",
		description:
			"Get help and support for AstroStats Discord bot. Find answers to common questions and contact our support team.",
		url: "https://astrostats.info/support",
	},
	twitter: {
		title: "Support - Get Help with AstroStats",
		description:
			"Get help and support for AstroStats Discord bot. Find answers to common questions and contact our support team.",
	},
};

export default function SupportPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="container mt-24 mx-auto px-12 py-4">
                <Support />
            </div>
            <Footer />
        </main>
    );
}
