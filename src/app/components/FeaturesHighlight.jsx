import React from "react";
import Link from "next/link";
import {
  CommandLineIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/solid"; // Example icons

const features = [
  {
    icon: <CommandLineIcon className="w-8 h-8 text-purple-400" />,
    title: "Easy Commands",
    description: "Access stats and horoscopes with simple, intuitive commands.",
  },
  {
    icon: <ChartBarIcon className="w-8 h-8 text-blue-400" />,
    title: "Game Stats",
    description:
      "Track player statistics for Apex Legends, League of Legends, and Fortnite.",
  },
  {
    icon: <StarIcon className="w-8 h-8 text-yellow-400" />,
    title: "Daily Horoscopes",
    description: "Get your daily horoscope readings directly in Discord.",
  },
];

const FeaturesHighlight = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
          Core Features
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          AstroStats offers a blend of gaming insights and cosmic guidance.
          Here's a glimpse:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm text-center hover:border-purple-500/60 transition-colors duration-300"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/commands">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
            Explore All Commands
          </button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturesHighlight;
