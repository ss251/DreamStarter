"use client";
import React, { useState } from "react";
import ConvertProposal from "@/components/launch/ConvertProposals";
import CreateProposal from "@/components/launch/CreateProposal";

const Launch = () => {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { title: "Create Proposal", content: <CreateProposal /> },
    { title: "Convert Proposal", content: <ConvertProposal /> },
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
    <>
      <div>
        <div className="flex justify-center mb-8">{renderTabs()}</div>

        <section id={tabs[activeTab]?.title} className="">
          {tabs[activeTab]?.content}
        </section>
      </div>
    </>
  );
};

export default Launch;
