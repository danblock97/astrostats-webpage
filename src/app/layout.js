import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Providers from "./components/Providers";
import Navbar from "./components/Navbar";
import SnowfallWrapper from "./components/SnowfallWrapper";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ 
	subsets: ["latin"],
	display: 'swap',
});

export const metadata = {
	metadataBase: new URL('https://astrostats.info'),
	title: "Astrostats - Your Discord Bot for Daily Horoscope and Game Stats",
	description:
		"Astrostats is your go-to Discord bot for daily horoscopes and player statistics in popular games like Apex Legends, Fortnite, and League of Legends. Stay connected with the cosmos and your gaming performance all in one place. Get personalized horoscope readings and track your progress in the gaming world seamlessly with Astrostats.",
	keywords: [
		"Discord bot",
		"horoscope",
		"Apex Legends stats",
		"Fortnite stats",
		"League of Legends stats",
		"gaming statistics",
		"Discord commands",
		"daily horoscope",
		"game tracking",
	],
	authors: [{ name: "AstroStats" }],
	creator: "AstroStats",
	publisher: "AstroStats",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://astrostats.info",
		siteName: "AstroStats",
		title: "Astrostats - Your Discord Bot for Daily Horoscope and Game Stats",
		description:
			"Astrostats is your go-to Discord bot for daily horoscopes and player statistics in popular games like Apex Legends, Fortnite, and League of Legends.",
		images: [
			{
				url: "/images/astrostats.png",
				width: 1200,
				height: 630,
				alt: "AstroStats Discord Bot Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Astrostats - Your Discord Bot for Daily Horoscope and Game Stats",
		description:
			"Astrostats is your go-to Discord bot for daily horoscopes and player statistics in popular games like Apex Legends, Fortnite, and League of Legends.",
		images: ["/images/astrostats.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		// Add Google Search Console verification if available
	},
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	themeColor: '#121212',
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": "https://astrostats.info/#organization",
			"name": "AstroStats",
			"url": "https://astrostats.info",
			"logo": {
				"@type": "ImageObject",
				"url": "https://astrostats.info/images/astrostats.png",
			},
			"sameAs": [
				"https://discord.gg/BeszQxTn9D",
			],
		},
		{
			"@type": "WebSite",
			"@id": "https://astrostats.info/#website",
			"url": "https://astrostats.info",
			"name": "AstroStats",
			"description": "Discord bot for daily horoscopes and gaming statistics",
			"publisher": {
				"@id": "https://astrostats.info/#organization",
			},
			"inLanguage": "en-US",
		},
		{
			"@type": "SoftwareApplication",
			"@id": "https://astrostats.info/#software",
			"name": "AstroStats Discord Bot",
			"applicationCategory": "GameApplication",
			"operatingSystem": "Discord",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD",
			},
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": "4.5",
				"ratingCount": "5000",
			},
			"description": "Discord bot providing daily horoscopes and player statistics for Apex Legends, Fortnite, League of Legends, and more.",
			"featureList": [
				"Daily horoscopes",
				"Apex Legends statistics",
				"Fortnite statistics",
				"League of Legends statistics",
				"Pet battles",
				"Squid games",
				"Welcome messages",
			],
		},
	],
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://discord.com" />
				<link rel="preconnect" href="https://va.vercel-scripts.com" />
				<link rel="dns-prefetch" href="https://discord.com" />
				<link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
