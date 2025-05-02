import Navbar from "@/app/components/Navbar";
import Support from "@/app/components/Support";

export default function SupportPage() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
			<div className="container max-w-7xl mt-24 mx-auto py-4 px-4 md:px-8 lg:px-12">
				<Support />
			</div>
		</main>
	);
}
