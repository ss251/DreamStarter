"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

const HeroSection = () => {
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="font-medium text-5xl text-center">
          Revolutionizing Web3 Community Building, <br /> Event Creation, and Secure Crowdfunding
        </h1>
      </div>
      <div>
        <div className="flex justify-center mt-8">
          <Link href="/auth/signup">
            <Button size="md" variant="primary">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
