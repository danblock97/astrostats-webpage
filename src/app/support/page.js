import Support from "../components/Support";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
