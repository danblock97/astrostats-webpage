import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Astrostats - Your Discord Bot for Daily Horoscope and Game Stats",
	description:
		"Astrostats is your go-to Discord bot for daily horoscopes and player statistics in popular games like Apex Legends, Fortnite, and League of Legends. Stay connected with the cosmos and your gaming performance all in one place. Get personalized horoscope readings and track your progress in the gaming world seamlessly with Astrostats.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
