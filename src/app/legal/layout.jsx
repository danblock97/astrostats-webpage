import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LegalLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Navbar />
      <main className="flex-grow container mx-auto px-12 py-16 mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
