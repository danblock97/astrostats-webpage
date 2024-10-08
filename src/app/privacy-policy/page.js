import Navbar from "@/app/components/Navbar";
import PrivacyPolicy from "@/app/components/PrivacyPolicy";

export default function PrivacyPolicyPage() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
			<div className="container mt-24 mx-auto py-4 px-12">
				<PrivacyPolicy />
			</div>
		</main>
	);
}
