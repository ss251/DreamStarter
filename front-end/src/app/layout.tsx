"use client";

import Nav from "@/components/LandingPage/Nav";
import "./globals.css";
import { Montserrat } from "next/font/google";

import React, { FC, useState, useEffect } from "react";

import { modalConfig, openloginAdapter } from "@/web3";
import { Web3AuthModalPack } from "@safe-global/auth-kit";

import {
  ADAPTER_EVENTS,
  SafeEventEmitterProvider,
  UserInfo,
} from "@web3auth/base";
import { Web3AuthEventListener } from "@safe-global/auth-kit";
import { AuthKitSignInData } from "@safe-global/auth-kit";

const connectedHandler: Web3AuthEventListener = (data) =>
  console.log("CONNECTED", data);
const disconnectedHandler: Web3AuthEventListener = (data) =>
  console.log("DISCONNECTED", data);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] =
    useState<AuthKitSignInData | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>();

  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const web3AuthModalPack = new Web3AuthModalPack({
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      await web3AuthModalPack.init({
        options: {
          clientId:
            "BOoluL4O3QhjHfKjsZmLZlrRvPDdtvcfSl3kq3hXBwbZI_nMbvqHm3tsQGxW4SJsrCtZc2WrGwa3XBQP4j6yJvY",
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth_goerli",
          },
        },
        adapters: [openloginAdapter],
        modalConfig,
      });
      console.log("water");

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
      web3AuthModalPack.subscribe(
        ADAPTER_EVENTS.DISCONNECTED,
        disconnectedHandler
      );

      setWeb3AuthModalPack(web3AuthModalPack);
      return () => {
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.CONNECTED,
          connectedHandler
        );
        web3AuthModalPack.unsubscribe(
          ADAPTER_EVENTS.DISCONNECTED,
          disconnectedHandler
        );
      };
    })();
  }, []);

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      (async () => {
        await login();
      })();
    }
  }, [web3AuthModalPack]);

  const login = async () => {
    if (!web3AuthModalPack) return;
    const signInInfo = await web3AuthModalPack.signIn();
    console.log("SIGN IN RESPONSE: ", signInInfo);
    const userInfo = await web3AuthModalPack.getUserInfo();
    console.log("USER INFO: ", userInfo);
    setSafeAuthSignInResponse(signInInfo);
    setUserInfo(userInfo || undefined);
    setProvider(web3AuthModalPack.getProvider() as SafeEventEmitterProvider);
  };

  const logout = async () => {
    if (!web3AuthModalPack) return;

    await web3AuthModalPack.signOut();

    setProvider(null);
    setSafeAuthSignInResponse(null);
  };

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div className="absolute glow left-0 top-10"></div>
        <div className="absolute glow-right right-0 top-10"></div>
        <div>
          <Nav
            onLogin={login}
            onLogout={logout}
            userInfo={userInfo}
            signInInfo={safeAuthSignInResponse}
            isLoggedIn={!!provider}
          />
        </div>

        <div>{children}</div>
      </body>
    </html>
  );
}

const montserrat = Montserrat({
  weight: ["200", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
