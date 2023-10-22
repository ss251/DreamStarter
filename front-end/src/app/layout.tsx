"use client";

import Nav from "@/components/LandingPage/Nav";
import "./globals.css";
import { Montserrat } from "next/font/google";

import React, { FC, useState, useEffect } from "react";
import { ProposalProvider } from "@/app/ProposalProvider";

import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <ThirdwebProvider 
        activeChain="mumbai" 
        clientId="5be238b6d90aced04e9db46730f231da" 
        supportedWallets={[
          metamaskWallet(),
          coinbaseWallet({ recommended: true }),
          walletConnect(),
          localWallet(),
          embeddedWallet(),
        ]}
      >
        <body className={montserrat.className}>
          <div className="absolute glow left-0 top-10"></div>
          <div className="absolute glow-right right-0 top-10"></div>
          <div>
            <Nav/>
          </div>
          <ProposalProvider>        
            <div>{children}</div>
          </ProposalProvider>
        </body>
      </ThirdwebProvider>
    </html>
  );
}

const montserrat = Montserrat({
  weight: ["200", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
