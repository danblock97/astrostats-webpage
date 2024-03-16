import Image from "next/image";
import Navbar from "./commponents/Navbar";
import HeroSection from "./commponents/HeroSection";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
			<div className="container mt-24 mx-auto py-4 px-12">
				<HeroSection />
			</div>
		</main>
	);
}
