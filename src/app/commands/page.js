import Commands from "../components/Commands";

export const metadata = {
	title: "Commands - AstroStats Discord Bot",
	description:
		"Discover all the powerful commands AstroStats has to offer. Get daily horoscopes, track Apex Legends stats, Fortnite stats, League of Legends stats, and more with simple Discord commands.",
	openGraph: {
		title: "Commands - AstroStats Discord Bot",
		description:
			"Discover all the powerful commands AstroStats has to offer. Get daily horoscopes, track gaming stats, and more.",
		url: "https://astrostats.info/commands",
	},
	twitter: {
		title: "Commands - AstroStats Discord Bot",
		description:
			"Discover all the powerful commands AstroStats has to offer. Get daily horoscopes, track gaming stats, and more.",
	},
};

export default function CommandsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <div className="container mt-16 mx-auto py-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Command Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover all the powerful features and commands AstroStats has to offer for your Discord server.
          </p>
          <div className="mt-6 w-24 h-1 bg-purple-500 mx-auto"></div>
        </div>
        <Commands />
      </div>
    </main>
  );
}
