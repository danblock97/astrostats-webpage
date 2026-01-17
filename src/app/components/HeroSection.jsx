"use client";

import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

const HeroSection = () => {
	return (
		<section>
			<div className="grid grid-cols-1 sm:grid-cols-12">
				<div className="col-span-8 place-self-center text-center sm:text-left justify-self-start">
					<h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
							Welcome to AstroStats{" "}
						</span>
						<br />
						<TypeAnimation
							sequence={[
								"Horoscopes",
								1000,
								"Apex Legends",
								1000,
								"League of Legends",
								1000,
							"Fortnite",
							1000,
							"Pet Battles",
							1000,
							"Squid Games",
							1000,
							]}
							wrapper="span"
							speed={50}
							repeat={Infinity}
						/>
					</h1>
					<p className="text-[#adb7be] text-base sm:text-lg mb-6 lg:text-xl">
						Your ultimate companion for staying updated on daily horoscopes and
						tracking player stats across various popular games! Whether you're
						seeking cosmic guidance or aiming to dominate in your favorite
						gaming titles like Apex Legends, League of Legends, Fortnite, Pet Battles, and Squid Games,
						this bot has you covered.
					</p>
					<Link href="https://discord.com/oauth2/authorize?client_id=1088929834748616785&permissions=378944&integration_type=0&scope=bot+applications.commands">
						<button className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:bg-slate-200 text-white">
							Invite AstroStats!
						</button>
					</Link>
					<Link href="https://discord.gg/BeszQxTn9D">
						<button className="px-1 py-1 w-full sm:w-fit rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:bg-slate-800 text-white mt-3">
							<span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
								Discord Support!
							</span>
						</button>
					</Link>
				</div>
				<div className="col-span-4 place-self-center mt-4 lg:mt-0">
					<div className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[300px] lg:h-[300px] relative">
						<Image
							src="/images/astrostats.png"
							alt="AstroStats Discord bot logo"
							className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-transparent"
							width={300}
							height={300}
							priority
							fetchPriority="high"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
