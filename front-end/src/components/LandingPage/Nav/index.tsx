import React, { FC, useState, useEffect } from "react";
import { GiTakeMyMoney } from "react-icons/gi";
import Button from "@/components/common/Button";
import { options, modalConfig, openloginAdapter, web3AuthConfig } from "@/web3";
import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3AuthEventListener } from "@safe-global/auth-kit";
import { AuthKitSignInData } from "@safe-global/auth-kit";
// import {SafeGetUser}
const connectedHandler: Web3AuthEventListener = (data) => console.log("CONNECTED", data);
const disconnectedHandler: Web3AuthEventListener = (data) => console.log("DISCONNECTED", data);

type AppBarProps = {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  signInInfo?: any;
  userInfo?: SafeGetUserInfoResponse<Web3AuthModalPack>;
};

const Nav = ({ isLoggedIn, onLogin, onLogout, userInfo, signInInfo }: AppBarProps) => {
  return (
    <div className="px-4 py-8 text-lg flex justify-between">
      <div className="flex gap-2 items-center">
        <div className="text-3xl">
          <GiTakeMyMoney />
        </div>
        <div>DreamStarter</div>
      </div>
      {/* ------------------  */}
      <div></div>

      {isLoggedIn ? (
        <>
          <Button size="md" variant="primary" onClick={onLogout}>
            {signInInfo?.eoa.slice(0, 3)}...{signInInfo?.eoa.slice(-2)} Logout
          </Button>
        </>
      ) : (
        <>
          <Button size="md" variant="primary" onClick={onLogin}>
            Login
          </Button>
        </>
      )}
    </div>
  );
};

export default Nav;
