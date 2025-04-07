"use client";

import { useEffect } from "react";
import $ from "jquery";

// Create functions in the global scope to be called from the buttons
const JiraIssueCollector = () => {
	useEffect(() => {
		// Make jQuery available globally for the Jira collector
		window.jQuery = $;
		window.$ = $;

		// Function to load the Bug Report collector and show dialog
		window.showBugReportCollector = () => {
			// Only load if not already loaded
			if (!window.bugReportCollectorLoaded) {
				window.bugReportCollectorLoaded = true;
				$.ajax({
					url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=6b41f9a6",
					type: "get",
					cache: true,
					dataType: "script",
					success: function () {
						// Once loaded, trigger the collector dialog
						if (window.ATL_JQ_PAGE_PROPS) {
							window.ATL_JQ_PAGE_PROPS = {
								// Assign a trigger function that just calls the available collector
								triggerFunction: function (showCollectorDialog) {
									showCollectorDialog();
								},
							};

							// Small timeout to ensure everything is ready
							setTimeout(function () {
								// This is the function that the Jira script adds to trigger the dialog
								if (typeof window.ATL_JQ_showCollectorDialog === "function") {
									window.ATL_JQ_showCollectorDialog();
								}
							}, 500);
						}
					},
				});
			} else {
				// If already loaded, just show the dialog
				if (typeof window.ATL_JQ_showCollectorDialog === "function") {
					window.ATL_JQ_showCollectorDialog();
				}
			}
		};

		// Function to load the Feature Request collector and show dialog
		window.showFeatureRequestCollector = () => {
			// Only load if not already loaded
			if (!window.featureRequestCollectorLoaded) {
				window.featureRequestCollectorLoaded = true;
				$.ajax({
					url: "https://danblock1997.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/xghl7j/b/9/b0105d975e9e59f24a3230a22972a71a/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-GB&collectorId=753db21b",
					type: "get",
					cache: true,
					dataType: "script",
					success: function () {
						// Set up the feature request collector
						window.ATL_JQ_PAGE_PROPS_ADDITIONAL_COLLECTORS = [
							{
								id: "753db21b",
								triggerFunction: function (showCollectorDialog) {
									showCollectorDialog();
								},
							},
						];

						// Small timeout to ensure everything is ready
						setTimeout(function () {
							// Find the feature request collector dialog function
							if (window.require && typeof window.require === "function") {
								try {
									const issueCollector = window.require(
										"jira-integration/issue-collector/issue-collector"
									);
									if (issueCollector) {
										issueCollector();
									}
								} catch (e) {
									console.error("Error showing feature collector:", e);
								}
							}
						}, 500);
					},
				});
			} else {
				// If already loaded, just show the dialog
				if (window.require && typeof window.require === "function") {
					try {
						const issueCollector = window.require(
							"jira-integration/issue-collector/issue-collector"
						);
						if (issueCollector) {
							issueCollector();
						}
					} catch (e) {
						console.error("Error showing feature collector:", e);
					}
				}
			}
		};
	}, []);

	return null; // This component doesn't render anything
};

export default JiraIssueCollector;
