import HeroSection from "./components/HeroSection";
import FeatruresHighlight from "./components/FeaturesHighlight";
import TrustedBy from "./components/TrustedBy";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <div className="container mt-24 mx-auto py-4 px-12 flex-grow">
        <TrustedBy />
        <HeroSection />
        <div className="mt-16">
          <FeatruresHighlight />
        </div>
      </div>
    </main>
  );
}
