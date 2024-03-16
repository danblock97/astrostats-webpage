import Image from "next/image";
import Navbar from "./commponents/Navbar";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col bg-[#121212]">
			<Navbar />
		</main>
	);
}
