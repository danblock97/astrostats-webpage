import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatruresHighlight from "./components/FeaturesHighlight";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <div className="container mt-24 mx-auto py-4 px-12 flex-grow">
        <HeroSection />
        <div className="mt-16">
          <FeatruresHighlight />
        </div>
      </div>
      <Footer />
    </main>
  );
}
