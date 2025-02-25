"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
	{
		title: "Commands",
		path: "#commands",
	},
	{
		title: "Contact",
		path: "mailto:contact@danblock.dev?subject=Support Request",
	},
	{
		title: "Report a Bug",
		path: "#",
		id: "myCustomTrigger",
	},
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && !window.jQuery) {
			const jqueryScript = document.createElement("script");
			jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
			jqueryScript.async = true;
			document.body.appendChild(jqueryScript);
			// Wait for jQuery to load before loading the collector script.
			jqueryScript.onload = loadJiraCollector;
		} else {
			loadJiraCollector();
		}

		function loadJiraCollector() {
			const script = document.createElement("script");
			script.src =
				"https://danblock97.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/g2slup/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=66de944a";
			script.async = true;
			document.body.appendChild(script);
		}

		window.ATL_JQ_PAGE_PROPS = {
			fieldValues: {
				components: ["10320"],
				priority: "2",
			},
			triggerFunction: function (showCollectorDialog) {
				// Use delegated event binding to catch clicks from both desktop and mobile buttons.
				window.jQuery(document).on("click", "#myCustomTrigger", function (e) {
					e.preventDefault();
					showCollectorDialog();
				});
			},
		};
	}, []);

	return (
		<nav className="fixed mx-auto top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">
			<div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
				<Link href="/" className="text-2xl md:text-5xl text-white font-semibold">
					AstroStats
				</Link>
				<div className="mobile-menu block md:hidden">
					{!navbarOpen ? (
						<button
							onClick={() => setNavbarOpen(true)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<Bars3Icon className="h-5 w-5" />
						</button>
					) : (
						<button
							onClick={() => setNavbarOpen(false)}
							className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
						>
							<XMarkIcon className="h-5 w-5" />
						</button>
					)}
				</div>
				<div className="menu hidden md:block md:w-auto" id="navbar">
					<ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
						{navLinks.map((link, index) => (
							<li key={index}>
								{link.id ? (
									<button id={link.id} className="block py-2 pl-3 pr-4 text-[#adb7be] sm:text-xl rounded md:p-0 hover:text-white">
										{link.title}
									</button>
								) : (
									<NavLink href={link.path} title={link.title} />
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
			{navbarOpen ? <MenuOverlay links={navLinks} /> : null}
		</nav>
	);
};

export default Navbar;
