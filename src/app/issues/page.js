import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import KanbanBoard from "../components/KanbanBoard";

export default function IssuesPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="container mt-24 mx-auto px-4 py-4 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Public Issues</h1>
                    <p className="text-gray-400">Track the development of AstroStats. View bugs and feature requests.</p>
                </div>
                <KanbanBoard />
            </div>
            <Footer />
        </main>
    );
}
