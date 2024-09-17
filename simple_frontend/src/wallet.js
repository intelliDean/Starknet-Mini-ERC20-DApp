// wallet.js
import { connect, disconnect } from "starknetkit";
import { RpcProvider } from "starknet";

const { VITE_SEPOLIA_URL } = import.meta.env;

const PROVIDER = new RpcProvider({
  nodeUrl: VITE_SEPOLIA_URL,
});

export const connectWallet = async (
  address,
  setProvider,
  setAccount,
  setAddress
) => {
  if (address) {
    disconnect();
    setProvider(null);
    setAccount(null);
    setAddress(null);
    return;
  }

  const { wallet } = await connect({
    provider: PROVIDER,
  });

  if (wallet && wallet.isConnected) {
    setProvider(wallet.provider);
    setAccount(wallet.account);
    setAddress(wallet.selectedAddress);
  }
};

export const getProvider = () => PROVIDER;
