"use client";

import Image from "next/image";
import React, { useState, useEffect, useTransition } from "react";
import TabButton from "./TabButton";

const tab_data = [
	{
		title: "Commands",
		id: "commands",
		content: (
			<ul className="list-disc pl-2">
				<li>
					Squib Games | Usage: /squibgames | Take part in your very own Server
					Squid Games!
				</li>
				<li>
					Pet Battles | Usage: /petbattles | Engage with pet battles, earn XP
					and become top of the leaderboard!
				</li>
				<li>
					Horoscope | Usage: /horoscope 'sign' | Check your daily horoscope{" "}
				</li>
				<li>
					Apex Legends | Usage: /apex 'platform' 'name' | Check your Apex Stats{" "}
				</li>
				<li>
					Fortnite | Usage: /fortnite 'time' 'name' | Check your Fortnite Stats{" "}
				</li>
				<li>
					LoL | Usage: /league | Check your League Stats, Live Game Details! &
					Champion Mastery!{" "}
				</li>
				<li>TFT | Usage: /tft 'riotid' | Check your TFT Stats </li>
				<li>
					Show Newest Update | Usage: /show_update | Check out AstroStats latest
					changes
				</li>
			</ul>
		),
	},
	{
		title: "Coming Soon",
		id: "comingsoon",
		content: <ul className="list-disc pl-2"></ul>,
	},
];

const Commands = () => {
	const [tab, setTab] = useState("commands");
	const [isPending, startTransition] = useTransition();

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
	const [currentImage, setCurrentImage] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prevIndex) => (prevIndex + 1) % imageList.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [imageList.length]);

	return (
		<section className="text-white">
			<div className="md:grid md:grid-cols-[auto_500px] gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
				<div className="relative h-[500px] w-[500px] overflow-hidden">
					{/* Auto Carousel */}
					<Image
						src={imageList[currentImage]}
						alt="Command image"
						fill
						className="object-contain"
					/>
				</div>
				<div className="mt-4 md:mt-0 text-left flex flex-col h-full max-w-[500px]">
					<h2 className="text-4xl font-bold text-white mb-4">Commands</h2>
					<p className="text-base lg:text-lg">
						Daily Horoscope: Stay ahead of the cosmic curve with AstroStat's
						daily horoscope feature. Whether you're seeking insights into your
						love life, career prospects, or general well-being, AstroGamer
						delivers personalized horoscopes tailored to your zodiac sign,
						keeping you informed and prepared for the day ahead.
					</p>
					<p className="text-base lg:text-lg mt-4">
						Apex Legends Stats: Dive into the world of Apex Legends and track
						your progress with AstroStat's Apex Legends stats feature. From
						kill counts and wins to character-specific data, AstroGamer keeps
						you updated on your performance and helps you analyze your gameplay
						to refine your skills and dominate the battlefield.
					</p>
					<p className="text-base lg:text-lg mt-4">
						League of Legends Stats: Whether you're climbing the ranks or
						strategising with your team, AstroStat's League of Legends stats
						feature provides valuable insights into your gameplay. Keep tabs on
						your win rate, KDA ratio, champion mastery, and more, empowering you
						to level up your game and achieve victory on the Summoner's Rift.
					</p>
					<p className="text-base lg:text-lg mt-4">
						Fortnite Stats: Equip yourself with the knowledge you need to
						conquer the island in Fortnite with AstroStat's Fortnite stats
						feature. Track your match history, survival rate, and elimination
						stats, and compare your performance against friends and rivals to
						assert your dominance as the last one standing.
					</p>
					<div className="flex flex-row mt-8">
						<TabButton
							selectTab={() => handleTabChange("commands")}
							active={tab === "commands"}
						>
							Commands
						</TabButton>
						<TabButton
							selectTab={() => handleTabChange("comingsoon")}
							active={tab === "comingsoon"}
						>
							Coming Soon
						</TabButton>
					</div>
					<div className="mt-8">
						{tab_data.find((t) => t.id === tab)?.content ||
							"Tab content not found"}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Commands;
