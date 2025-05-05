import Navbar from "@/app/components/Navbar";
import Support from "@/app/components/Support";

export default function SupportPage() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
			<div className="w-full mt-24 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
				<Support />
			</div>
		</main>
	);
}
