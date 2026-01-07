export default function LegalLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <main className="flex-grow container mx-auto px-12 py-16 mt-16">
        {children}
      </main>
    </div>
  );
}
