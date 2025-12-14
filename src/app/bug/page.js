import Navbar from "@/app/components/Navbar";
import BugReport from "@/app/components/BugReport";
import IssueList from "@/app/components/IssueList";

export default function BugPage() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="w-full mt-24 px-4 md:px-8 lg:px-12 max-w-[1920px] mx-auto">
                <BugReport />
                <IssueList type="bug" />
            </div>
        </main>
    );
}
