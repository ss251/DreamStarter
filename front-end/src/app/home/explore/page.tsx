"use client";

import OngoingProposal from "@/components/explore/OngoingProposal";
import React, { useState } from "react";

const Explore = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Ongoing Proposals", content: <OngoingProposal /> },
    { title: "Crowdfunding Events", content: "Crowdfunding" },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const renderTabs = () => {
    return (
      <div className="flex gap-10 items-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => handleTabClick(index)}
            className={
              activeTab === index
                ? "underline underline-offset-4 cursor-pointer"
                : "cursor-pointer"
            }
          >
            {tab.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-center mb-8">{renderTabs()}</div>
      <section id={tabs[activeTab]?.title} className="">
        {tabs[activeTab]?.content}
      </section>
    </div>
  );
};

export default Explore;
