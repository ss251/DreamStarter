"use client";

import React, { useState } from "react";
import { useProposal } from "@/app/ProposalProvider";

import Button from "@/components/common/Button";
import Link from "next/link";

const OngoingProposal = () => {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const { proposal, votes, setVotes, votesPercentage, setVotesPercentage } =
    useProposal();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Update the votes count based on the user's vote
    const newVotes = { ...votes };
    if (selectedValue === "like") {
      newVotes.likes += 1;
    } else {
      newVotes.dislikes += 1;
    }
    setVotes(newVotes);

    // Calculate and update the votes percentage
    const totalVotes = newVotes.likes + newVotes.dislikes;
    const percentage = (newVotes.likes / totalVotes) * 100;
    setVotesPercentage(percentage);

    // Display the vote alert
    alert(`You voted ${selectedValue}`);
  };

  if (!proposal) return <p>No ongoing proposal</p>;

  return (
    <div className="flex justify-center mt-8">
      <div>
        {/* --------------------------------------- proposal card -------------------  */}
        <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
          <div className="">{proposal.title}</div>
          <div>{proposal.description}</div>
          <div>Price Per NFT: {proposal.priceperNFT} USDC</div>
          <div>Funding Goal: {proposal.funding_goal} USDC</div>
          <div>Valid Till: {proposal.date}</div>
          <div className="italic">
            Created by{" "}
            <Link
              href="https://twitter.com/thatweb3guy1"
              target="_blank"
              className="underline text-white/75"
            >
              Samuel Afolabi
            </Link>
          </div>

          {/* --------------------------------------  */}
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6 justify-center">
              <div>
                <label>
                  <input
                    type="radio"
                    value="dislike"
                    id="response"
                    checked={selectedValue === "dislike"}
                    onChange={() => setSelectedValue("dislike")}
                    required
                    className="hidden"
                  />
                  <div
                    className={`w-12 h-12 flex justify-center items-center text-lg hover:text-2xl hover:border-blue-500 py-2 border border-white/10 rounded-sm cursor-pointer ${
                      selectedValue === "dislike" && "border-blue-500 "
                    }`}
                  >
                    👎
                  </div>
                </label>
              </div>
              <div>
                <label>
                  <input
                    id="response"
                    type="radio"
                    value="like"
                    checked={selectedValue === "like"}
                    onChange={() => setSelectedValue("like")}
                    required
                    className="hidden"
                  />
                  <div
                    className={`w-12 h-12 flex  text-lg justify-center items-center hover:text-2xl  hover:border-blue-500 py-2 border border-white/10 rounded-sm cursor-pointer ${
                      selectedValue === "like" && "border-blue-500"
                    }`}
                  >
                    👍
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button variant="primary" size="md" type="submit">
                Vote
              </Button>
            </div>
          </form>
          {/* --------------------------------------  */}
        </div>

        {/* --------------------------------------- proposal card -------------------  */}
      </div>
    </div>
  );
};

export default OngoingProposal;
