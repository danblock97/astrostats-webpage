import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Providers from "./components/Providers";
import Navbar from "./components/Navbar";
import SnowfallWrapper from "./components/SnowfallWrapper";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Astrostats - Your Discord Bot for Daily Horoscope and Game Stats",
	description:
		"Astrostats is your go-to Discord bot for daily horoscopes and player statistics in popular games like Apex Legends, Fortnite, and League of Legends. Stay connected with the cosmos and your gaming performance all in one place. Get personalized horoscope readings and track your progress in the gaming world seamlessly with Astrostats.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<Script
					src="https://code.jquery.com/jquery-3.7.1.min.js"
					integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
					crossOrigin="anonymous"
					strategy="beforeInteractive"
				/>
			</head>
            <body className={inter.className}>
                <SnowfallWrapper />
                <Providers>
                    <Navbar />
                    {children}
                    <Footer />
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
		</html>
	);
}
