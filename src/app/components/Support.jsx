"use client";
import React, { useState } from "react";
import BugReport from "./BugReport";
import FeatureRequest from "./FeatureRequest";
import TabButton from "./TabButton";

const Support = () => {
    const [tab, setTab] = useState("bug");

    function handleTabChange(id) {
        setTab(id);
    }

    return (
        <section className="text-white">
            <div className="flex flex-row justify-center items-center gap-2 py-6">
                <TabButton
                    selectTab={() => handleTabChange("bug")}
                    active={tab === "bug"}
                >
                    Report a Bug
                </TabButton>
                <TabButton
                    selectTab={() => handleTabChange("feature")}
                    active={tab === "feature"}
                >
                    Request a Feature
                </TabButton>
            </div>
            <div className="mt-4">
                {tab === "bug" ? <BugReport /> : <FeatureRequest />}
            </div>
        </section>
    );
};

export default Support;
