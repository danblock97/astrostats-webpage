"use client";
import { useState, useEffect } from "react";
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
		title: "Report a Bug",
		path: "#", // Keep path as #
		id: "jiraBugTrigger", // Keep ID
	},
	{
		title: "Feature Request",
		path: "#", // Keep path as #
		id: "jiraFeatureTrigger", // Keep ID
	},
	{
		title: "Contact",
		path: "mailto:contact@danblock.dev?subject=Support Request",
	},
];

const Navbar = () => {
	const [navbarOpen, setNavbarOpen] = useState(false);

	useEffect(() => {
		const loadScript = (src, onLoad, onError) => {
			// Avoid adding script multiple times if already present
			if (document.querySelector(`script[src="${src}"]`)) {
				if (onLoad) {
					console.log(`Script already loaded: ${src}`);
					onLoad(); // Call onLoad even if script exists
				}
				return null;
			}
			const script = document.createElement("script");
			script.src = src;
			script.async = true;
			script.onload = () => {
				console.log(`Script loaded successfully: ${src}`);
				if (onLoad) onLoad();
			};
			script.onerror = () => {
				console.error(`Failed to load script: ${src}`);
				if (onError) onError();
			};
			document.body.appendChild(script);
			console.log(`Appending script: ${src}`);
			return script;
		};

		const initializeJiraTriggers = () => {
			if (!window.jQuery) {
				console.error("jQuery not loaded, cannot initialize Jira triggers.");
				return;
			}
			console.log("Initializing Jira triggers...");

			// Remove previous handlers if any, using namespace
			window.jQuery("#jiraBugTrigger").off("click.jira");
			window.jQuery("#jiraFeatureTrigger").off("click.jira");

			// Attach Bug Trigger
			window.jQuery("#jiraBugTrigger").on("click.jira", function (e) {
				e.preventDefault();
				console.log("Bug trigger clicked");

				// Load Bug Collector Script on demand using jQuery ajax
				window.jQuery.ajax({
					url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=8f26094d",
					type: "get",
					cache: true, // Enable caching
					dataType: "script",
					success: function () {
						console.log("Jira Bug Collector script loaded successfully.");
						// Define props *just before* showing
						window.ATL_JQ_PAGE_PROPS = window.ATL_JQ_PAGE_PROPS || {};
						// The triggerFunction needs to be set for the script to execute showCollectorDialog
						window.ATL_JQ_PAGE_PROPS.triggerFunction = function (
							showCollectorDialog
						) {
							console.log("Executing showCollectorDialog for Bug.");
							showCollectorDialog();
						};
						// Re-check if showCollectorDialog is available after script load (it might be added to ATL_JQ_PAGE_PROPS by the script)
						// if (window.ATL_JQ_PAGE_PROPS && window.ATL_JQ_PAGE_PROPS.showCollectorDialog) {
						//    window.ATL_JQ_PAGE_PROPS.showCollectorDialog();
						// } else {
						//    console.error("showCollectorDialog not found after bug script load.");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(
							"Failed to load Jira Bug Collector script:",
							textStatus,
							errorThrown
						);
					},
				});
			});

			// Attach Feature Trigger
			window.jQuery("#jiraFeatureTrigger").on("click.jira", function (e) {
				e.preventDefault();
				console.log("Feature trigger clicked");

				// Load Feature Collector Script on demand using jQuery ajax
				window.jQuery.ajax({
					url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=c779c24c",
					type: "get",
					cache: true, // Enable caching
					dataType: "script",
					success: function () {
						console.log("Jira Feature Collector script loaded successfully.");
						// Define props *just before* showing
						window.ATL_JQ_PAGE_PROPS = window.ATL_JQ_PAGE_PROPS || {};
						// The triggerFunction needs to be set for the script to execute showCollectorDialog
						window.ATL_JQ_PAGE_PROPS.triggerFunction = function (
							showCollectorDialog
						) {
							console.log("Executing showCollectorDialog for Feature.");
							showCollectorDialog();
						};
						// Re-check if showCollectorDialog is available after script load
						// if (window.ATL_JQ_PAGE_PROPS && window.ATL_JQ_PAGE_PROPS.showCollectorDialog) {
						//     window.ATL_JQ_PAGE_PROPS.showCollectorDialog();
						// } else {
						//     console.error("showCollectorDialog not found after feature script load.");
						// }
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(
							"Failed to load Jira Feature Collector script:",
							textStatus,
							errorThrown
						);
					},
				});
			});

			console.log("Jira triggers attached.");
		};

		// Load jQuery first, then initialize Jira triggers
		if (typeof window !== "undefined") {
			console.log("Running useEffect in Navbar");
			if (!window.jQuery) {
				console.log("jQuery not found, loading from CDN...");
				loadScript(
					"https://code.jquery.com/jquery-3.7.1.min.js",
					initializeJiraTriggers, // Initialize Jira triggers *after* jQuery loads
					() => {
						console.error("Failed to load jQuery from CDN.");
					}
				);
			} else {
				console.log("jQuery already loaded, initializing Jira triggers.");
				initializeJiraTriggers(); // jQuery already loaded
			}
		}

		// Cleanup function
		return () => {
			console.log("Cleaning up Navbar useEffect");
			if (window.jQuery) {
				console.log("Removing Jira click handlers");
				window.jQuery("#jiraBugTrigger").off("click.jira");
				window.jQuery("#jiraFeatureTrigger").off("click.jira");
			}
		};
	}, []); // Empty dependency array ensures this runs once on mount

	// ... rest of the component code ...

	return (
		<nav className="fixed mx-auto top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">
			<div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
				<Link
					href="/"
					className="text-2xl md:text-5xl text-white font-semibold"
				>
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
								{/* Pass id to NavLink */}
								<NavLink href={link.path} title={link.title} id={link.id} />
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
