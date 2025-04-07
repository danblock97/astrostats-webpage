"use client";

import { useEffect } from "react";

const JiraCollectors = () => {
	useEffect(() => {
		// Add script to the body
		const script = document.createElement("script");
		script.src = "https://code.jquery.com/jquery-3.6.4.min.js";
		script.async = true;
		script.onload = () => {
			// jQuery is now loaded, initialize collectors
			initializeCollectors();
		};
		document.body.appendChild(script);

		// Function to initialize both collectors
		const initializeCollectors = () => {
			// Ensure jQuery is loaded
			if (window.jQuery) {
				const $ = window.jQuery;

				// Setup bug report collector
				$("#reportBugButton").click(function (e) {
					e.preventDefault();

					// Load the bug report collector script if not already loaded
					if (!window.bugCollectorLoaded) {
						window.bugCollectorLoaded = true;
						$.ajax({
							url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=6b41f9a6",
							type: "get",
							cache: true,
							dataType: "script",
							success: function () {
								// Configure the trigger function
								window.ATL_JQ_PAGE_PROPS = {
									triggerFunction: function (showCollectorDialog) {
										showCollectorDialog();
									},
								};

								// Give the collector time to initialize
								setTimeout(function () {
									if (typeof window.ATL_JQ_showCollectorDialog === "function") {
										window.ATL_JQ_showCollectorDialog();
									}
								}, 500);
							},
						});
					} else if (typeof window.ATL_JQ_showCollectorDialog === "function") {
						// If already loaded, just show the dialog
						window.ATL_JQ_showCollectorDialog();
					}
				});

				// Setup feature request collector
				$("#featureRequestButton").click(function (e) {
					e.preventDefault();

					// Load the feature request collector script if not already loaded
					if (!window.featureCollectorLoaded) {
						window.featureCollectorLoaded = true;
						$.ajax({
							url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=753db21b",
							type: "get",
							cache: true,
							dataType: "script",
							success: function () {
								// Configure the feature request collector
								window.ATL_JQ_PAGE_PROPS_FEATURE_REQUEST = {
									triggerFunction: function (showCollectorDialog) {
										showCollectorDialog();
									},
								};

								// Additional collectors configuration
								window.ATL_JQ_PAGE_PROPS_ADDITIONAL_COLLECTORS = [
									{
										id: "753db21b",
										triggerFunction: function (showCollectorDialog) {
											showCollectorDialog();
										},
									},
								];

								// Give the collector time to initialize
								setTimeout(function () {
									// Try to trigger the collector dialog
									if (
										window.ATL_JQ_PAGE_PROPS_ADDITIONAL_COLLECTORS &&
										window.ATL_JQ_PAGE_PROPS_ADDITIONAL_COLLECTORS[0] &&
										typeof window.require === "function"
									) {
										try {
											const collector = window.require(
												"jira-integration/issue-collector/issue-collector"
											);
											if (collector) {
												collector();
											}
										} catch (e) {
											console.error("Error showing feature collector:", e);
										}
									}
								}, 500);
							},
						});
					} else if (typeof window.require === "function") {
						// If already loaded, just show the dialog
						try {
							const collector = window.require(
								"jira-integration/issue-collector/issue-collector"
							);
							if (collector) {
								collector();
							}
						} catch (e) {
							console.error("Error showing feature collector:", e);
						}
					}
				});

				// Create a MutationObserver to attach handlers to dynamically loaded elements
				const observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						const nodes = Array.from(mutation.addedNodes);
						nodes.forEach(function (node) {
							if (node.nodeType === 1) {
								// Element node
								const reportButtons = node.querySelectorAll("#reportBugButton");
								const featureButtons = node.querySelectorAll(
									"#featureRequestButton"
								);

								reportButtons.forEach((button) => {
									$(button)
										.off("click")
										.click(function (e) {
											e.preventDefault();
											$("#reportBugButton").first().trigger("click");
										});
								});

								featureButtons.forEach((button) => {
									$(button)
										.off("click")
										.click(function (e) {
											e.preventDefault();
											$("#featureRequestButton").first().trigger("click");
										});
								});
							}
						});
					});
				});

				// Start observing for dynamically added elements (like in mobile menu)
				observer.observe(document.body, { childList: true, subtree: true });
			}
		};

		// Clean up function
		return () => {
			// Remove any observers or event handlers if needed
		};
	}, []);

	return null;
};

export default JiraCollectors;
