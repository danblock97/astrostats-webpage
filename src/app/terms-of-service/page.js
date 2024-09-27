import Navbar from "@/app/components/Navbar";
import TermsOfService from "@/app/components/TermsOfService";

export default function TermsOfServicePage() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
			<div className="container mt-24 mx-auto py-4 px-12">
				<TermsOfService />
			</div>
		</main>
	);
}
