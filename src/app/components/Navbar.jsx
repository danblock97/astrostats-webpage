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
		id: "myCustomTrigger", // This id is used by the Jira collector trigger.
	},
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);

	useEffect(() => {
		// 1. Load jQuery if it isn't already loaded.
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

		// 2. Function to load the Jira issue collector script.
		function loadJiraCollector() {
			const script = document.createElement("script");
			script.src =
				"https://danblock97.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/g2slup/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=89e027d5";
			script.async = true;
			document.body.appendChild(script);
		}

		// 3. Set up the ATL_JQ_PAGE_PROPS for the collector.
		// This must be done on the client side after jQuery is available.
		window.ATL_JQ_PAGE_PROPS = {
			triggerFunction: function (showCollectorDialog) {
				// Wait until the DOM is fully loaded and jQuery is available.
				window.jQuery("#myCustomTrigger").click(function (e) {
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
									// Render a button for "Report a Bug" with the matching id.
									<button id={link.id} className="text-white hover:text-gray-300">
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
