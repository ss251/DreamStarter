import { Web3AuthModalPack, Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthOptions } from "@web3auth/modal";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  UserInfo,
  WALLET_ADAPTERS,
} from "@web3auth/base";

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments

//Initialize within your constructor
export const options = new Web3Auth({
  clientId:
    "BCzN3eX5wyI7gd1g4EQt7n4IEb43J-jBXdFa2rFtNnL-zSHoYeSTFPQR7RcIUEErw9INhSU84Eiih_5urgr2PeA",
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1",
  },
});

// await web3auth.initModal();

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
export const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: "torus",
    showOnModal: true,
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: "metamask",
    showOnDesktop: true,
    showOnMobile: false,
  },
};

// https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
export const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "mandatory",
  },

  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      name: "Safe",
    },
  },
});

export const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: "https://safe-transaction-goerli.safe.global",
};

// instatiating
// const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

// export const initWeb3AuthModal = async () => {
//   await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig });
//   const Loaded = true;
//   const authKitSignData = await web3AuthModalPack.signIn();
//   console.log("signed");

//   return { authKitSignData, Loaded };
// };
