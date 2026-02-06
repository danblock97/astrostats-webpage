"use client";

import Image from "next/image";
import React, { useState, useEffect, useTransition } from "react";
import TabButton from "./TabButton";
import { TypeAnimation } from "react-type-animation";

const commandData = [
	{
		title: "Welcome Toggle",
		usage: "/welcome toggle",
		description:
			"Toggle welcome messages on or off for your server. Available for all tiers.",
		category: "welcome",
		icon: "👋",
		tier: "Free",
	},
	{
		title: "Welcome Message",
		usage: "/welcome set-message",
		description:
			"Set a custom welcome message with placeholders ({user}, {server}, etc). Supports formatting.",
		category: "welcome",
		icon: "✏️",
		tier: "Supporter+",
	},
	{
		title: "Remove Welcome Message",
		usage: "/welcome remove-message",
		description:
			"Remove your custom welcome message and revert to the default one.",
		category: "welcome",
		icon: "🗑️",
		tier: "Supporter+",
	},
	{
		title: "Welcome Image",
		usage: "/welcome set-image",
		description:
			"Set a custom welcome image (PNG, JPG, WEBP, GIF). Supports animated GIFs with auto-compression.",
		category: "welcome",
		icon: "🖼️",
		tier: "Sponsor+",
	},
	{
		title: "Remove Welcome Image",
		usage: "/welcome remove-image",
		description: "Remove your custom welcome image.",
		category: "welcome",
		icon: "❌",
		tier: "Sponsor+",
	},
	{
		title: "Test Welcome",
		usage: "/welcome test",
		description:
			"Preview your welcome message setup. Only available to server admins.",
		category: "welcome",
		icon: "🔍",
		tier: "All Tiers",
	},
	{
		title: "Statuspage Enable",
		usage: "/statuspage enable <channel>",
		description: "Enable AstroStats status updates in a channel.",
		category: "system",
		icon: "📈",
		tier: "All Tiers",
		permission: "Manage Server",
	},
	{
		title: "Statuspage Disable",
		usage: "/statuspage disable",
		description: "Disable AstroStats status updates.",
		category: "system",
		icon: "🛑",
		tier: "All Tiers",
		permission: "Manage Server",
	},
	{
		title: "Statuspage Test",
		usage: "/statuspage test <channel>",
		description: "Send a sample status update embed.",
		category: "system",
		icon: "🧪",
		tier: "All Tiers",
		permission: "Manage Server",
	},
	{
		title: "Squib Games",
		usage: "/squibgames",
		description: "Take part in your very own Server Squid Games!",
		category: "games",
		icon: "🦑",
	},
	{
		title: "Pet Battles",
		usage: "/petbattles",
		description:
			"Engage with pet battles, earn XP and become top of the leaderboard!",
		category: "games",
		icon: "🐾",
	},
	{
		title: "Horoscope",
		usage: "/horoscope 'sign'",
		description: "Check your daily horoscope",
		category: "lifestyle",
		icon: "✨",
	},
	{
		title: "Apex Legends",
		usage: "/apex 'platform' 'name'",
		description: "Check your Apex Stats",
		category: "gaming",
		icon: "🎮",
	},
	{
		title: "Fortnite",
		usage: "/fortnite 'time' 'name'",
		description: "Check your Fortnite Stats",
		category: "gaming",
		icon: "🏆",
	},
	{
		title: "League of Legends",
		usage: "/league",
		description:
			"Check your League Stats, Live Game Details! & Champion Mastery!",
		category: "gaming",
		icon: "🏅",
	},
	{
		title: "TFT",
		usage: "/tft 'riotid'",
		description: "Check your TFT Stats",
		category: "gaming",
		icon: "🔮",
	},
	{
		title: "Show Newest Update",
		usage: "/show_update",
		description: "Check out AstroStats latest changes",
		category: "system",
		icon: "📢",
	},
	{
		title: "Truth or Dare",
		usage: "/truthordare",
		description: "SFW & NSFW",
		category: "social",
		icon: "🎭",
	},
	{
		title: "Would You Rather",
		usage: "/wouldyourather",
		description: "SFW & NSFW",
		category: "social",
		icon: "🤔",
	},
	{
		title: "Premium Info",
		usage: "/premium",
		description: "Information about AstroStats premium features",
		category: "system",
		icon: "💎",
	},
	{
		title: "Astronomy Picture",
		usage: "/apod",
		description: "Astronomy Picture of the Day from NASA",
		category: "cosmos",
		icon: "🌌",
	},
	{
		title: "International Space Station",
		usage: "/iss",
		description: "Real-time location of the International Space Station",
		category: "cosmos",
		icon: "🛰️",
	},
	{
		title: "People in Space",
		usage: "/people",
		description: "List of humans currently in space",
		category: "cosmos",
		icon: "👨‍🚀",
	},
	{
		title: "Rocket Launch",
		usage: "/launch",
		description: "Information on the next upcoming rocket launch",
		category: "cosmos",
		icon: "🚀",
	},
];

const tab_data = [
	{
		title: "Commands",
		id: "commands",
		content: (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{commandData.map((command, index) => (
					<div
						key={index}
						className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg p-4 border border-purple-500/30 hover:border-purple-500/80 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 backdrop-blur-sm group"
					>
						<div className="flex items-center mb-3">
							<span className="text-2xl mr-3 bg-gradient-to-r from-purple-500 to-indigo-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:animate-pulse">
								{command.icon}
							</span>
							<div className="flex-1">
								<h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
									{command.title}
								</h3>
								<div className="mt-1 flex flex-wrap gap-2">
									{command.tier && (
										<span
											className={`text-xs px-2 py-0.5 rounded-full ${
												command.tier === "Free"
													? "bg-gray-700/50 text-gray-300"
													: command.tier === "Supporter+"
													? "bg-sky-900/50 text-sky-300"
													: command.tier === "Sponsor+"
													? "bg-fuchsia-900/50 text-fuchsia-300"
													: command.tier === "VIP+"
													? "bg-amber-900/50 text-amber-300"
													: "bg-indigo-900/50 text-indigo-300"
											}`}
										>
											{command.tier}
										</span>
									)}
									{command.permission && (
										<span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/50 text-rose-300 border border-rose-500/30">
											{command.permission}
										</span>
									)}
								</div>
							</div>
						</div>
						<div className="pl-2 border-l-2 border-purple-500/50 ml-5">
							<p className="text-gray-300 mb-2 font-mono text-sm">
								<span className="text-indigo-400 font-semibold">Usage:</span>{" "}
								{command.usage}
							</p>
							<p className="text-gray-200">{command.description}</p>
						</div>
					</div>
				))}
			</div>
		),
	},
	{
		title: "Coming Soon",
		id: "comingsoon",
		content: (
			<div className="flex items-center justify-center h-64 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20 backdrop-blur-sm">
				<div className="text-center">
					<span className="text-4xl mb-4 inline-block">🚀</span>
					<h3 className="text-xl font-bold text-purple-400 mb-2">
						New Commands Under Development
					</h3>
					<p className="text-gray-300 max-w-md mx-auto">
						Our team is working on exciting new features. Stay tuned for
						updates!
					</p>
				</div>
			</div>
		),
	},
];

const featureData = [
	{
		title: "Daily Horoscope",
		description:
			"Stay ahead of the cosmic curve with personalized horoscopes tailored to your zodiac sign.",
		icon: "✨",
	},
	{
		title: "Apex Legends Stats",
		description:
			"Track your progress from kill counts and wins to character-specific data.",
		icon: "🎮",
	},
	{
		title: "League of Legends Stats",
		description:
			"Monitor win rates, KDA ratios, champion mastery, and more to level up your game.",
		icon: "🏆",
	},
	{
		title: "Fortnite Stats",
		description:
			"Track match history, survival rate, and elimination stats to dominate the island.",
		icon: "🔫",
	},
];

const Commands = () => {
	const [tab, setTab] = useState("commands");
	const [isPending, startTransition] = useTransition();
	const [hoveredFeature, setHoveredFeature] = useState(null);

	const handleTabChange = (id) => {
		startTransition(() => {
			setTab(id);
		});
	};

	// Carousel state and logic
	const imageList = [
		"/images/ApexCommand.png",
		"/images/ChampionMasteryCommand.png",
		"/images/FortniteCommand.png",
		"/images/HoroscopeCommand.png",
		"/images/LeagueCommand.png",
	];
	const imageAltTexts = [
		"Apex Legends stats command example showing player statistics",
		"League of Legends champion mastery command example",
		"Fortnite stats command example showing player performance",
		"Daily horoscope command example for zodiac signs",
		"League of Legends stats command example showing match details",
	];
	const [currentImage, setCurrentImage] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prevIndex) => (prevIndex + 1) % imageList.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [imageList.length]);

	return (
		<section className="text-white relative">
			{/* Decorative background elements */}
			<div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
			<div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>

			<div className="relative z-10 flex flex-col gap-8 py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
				{/* Image section - Now bigger and at the top */}
				<div className="w-full">
					<div className="relative h-[600px] w-full max-w-[800px] mx-auto overflow-hidden rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.3)] border border-purple-500/30 backdrop-blur-sm">
						{/* Carousel */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10 pointer-events-none"></div>
						<Image
							src={imageList[currentImage]}
							alt={imageAltTexts[currentImage]}
							fill
							className="object-contain"
							priority
						/>

						{/* Carousel indicators */}
						<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
							{imageList.map((_, index) => (
								<button
									key={index}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${
										currentImage === index
											? "bg-purple-500 w-6"
											: "bg-gray-400/50 hover:bg-gray-300/70"
									}`}
									onClick={() => setCurrentImage(index)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Content section */}
				<div className="col-span-7 text-left flex flex-col h-full">
					<div className="mb-6">
						<h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent inline-block">
							Command Center
						</h2>
						<div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4"></div>
						<TypeAnimation
							sequence={[
								"Unleash the full power of AstroStats",
								2000,
								"Track your game stats with simple commands",
								2000,
								"Enhance your Discord server experience",
								2000,
							]}
							wrapper="p"
							speed={50}
							className="text-lg text-gray-300 italic"
							repeat={Infinity}
						/>
					</div>

					{/* Feature cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
						{featureData.map((feature, index) => (
							<div
								key={index}
								className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300"
								onMouseEnter={() => setHoveredFeature(index)}
								onMouseLeave={() => setHoveredFeature(null)}
							>
								<div className="flex items-center mb-2">
									<span className="text-2xl mr-3">{feature.icon}</span>
									<h3
										className={`font-bold transition-all duration-300 ${
											hoveredFeature === index
												? "text-purple-400"
												: "text-white"
										}`}
									>
										{feature.title}
									</h3>
								</div>
								<p className="text-gray-300 text-sm">{feature.description}</p>
							</div>
						))}
					</div>

					{/* Tab buttons */}
					<div className="flex flex-row mb-6 bg-gray-900/50 p-1 rounded-lg backdrop-blur-sm w-fit">
						<TabButton
							selectTab={() => handleTabChange("commands")}
							active={tab === "commands"}
						>
							Available Commands
						</TabButton>
						<TabButton
							selectTab={() => handleTabChange("comingsoon")}
							active={tab === "comingsoon"}
						>
							Coming Soon
						</TabButton>
					</div>

					{/* Tab content */}
					<div className="bg-gray-900/30 p-4 rounded-lg backdrop-blur-sm border border-gray-700/50">
						{tab_data.find((t) => t.id === tab)?.content ||
							"Tab content not found"}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Commands;
