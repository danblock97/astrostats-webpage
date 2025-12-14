import Navbar from "@/app/components/Navbar";
import FeatureRequest from "@/app/components/FeatureRequest";
import IssueList from "@/app/components/IssueList";

export default function FeatureRequestPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="w-full mt-24 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
                <FeatureRequest />
                <IssueList type="feature" />
            </div>
        </main>
    );
}
