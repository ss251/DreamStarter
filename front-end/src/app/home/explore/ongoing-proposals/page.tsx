"use client"

import React, { useState } from "react";

import Button from "@/components/common/Button";
import Link from "next/link";

const OngoingProposal = () => {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedValue) {
      alert(`Please like or dislike the proposal before clicking on vote`);
    } else alert(`You voted ${selectedValue}`);
  };
  return (
    <div className="flex justify-center mt-8">
      <div>
        {/* --------------------------------------- proposal card -------------------  */}
        <div className="w-[500px] text-white/80 text-sm border rounded-sm border-white/20 px-4 py-4 flex flex-col gap-4">
          <div className="">This is Proposal Title</div>
          <div>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as thei
          </div>

          <div>Price Per NFT: 0.01 USDC</div>
          <div>Funding Goal: 500 USDC</div>
          <div>Valid Till: 15/11/2023</div>
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
