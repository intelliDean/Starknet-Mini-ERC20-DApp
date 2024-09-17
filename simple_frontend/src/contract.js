// contract.js
import { Contract } from "starknet";
import { BigNumber } from "bignumber.js";
import { convertFelt252ToString } from "./assets/utilityFunction";

// Contract configuration
const CONTRACT_ADDRESS =
  "0x029c179c3803a1c3567958b769dde585518db8a79bfbccf529f28fc27c248791";

export const viewContract = (provider, ABI) => {
  return new Contract(ABI, CONTRACT_ADDRESS, provider);
};

export const stateChangeContract = (account, ABI) => {
  return new Contract(ABI, CONTRACT_ADDRESS, account);
};

// Contract functions
export const getName = async (provider, ABI, setName, toast) => {
  if (provider) {
    const contract = viewContract(provider, ABI);

    try {
      const tx = await contract.name();
      setName(convertFelt252ToString(tx));
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};

export const getSymbol = async (provider, ABI, setSymbol, toast) => {
  if (provider) {
    const contract = viewContract(provider, ABI);

    try {
      const tx = await contract.symbol();
      setSymbol(convertFelt252ToString(tx));
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};

export const getOwner = async (provider, ABI, setOwner, toast) => {
  if (provider) {
    const contract = viewContract(provider, ABI);

    try {
      const tx = await contract.owner();
      const hex_it = "0x" + tx.toString(16);
      setOwner(hex_it);
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};

export const balance_of = async (provider, ABI, addr, setBalance, toast) => {
  if (provider) {
    const contract = viewContract(provider, ABI);

    try {
      const tx = await contract.balance_of(addr);

      setBalance(BigNumber(tx).toString());
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};

export const mintTokens = async (account, ABI, provider, r, a, toast) => {
  if (account) {
    const contract = stateChangeContract(account, ABI);

    try {
      const res = await contract.mint(r, a);

      const txHash = res?.transaction_hash;
      const txResult = await provider.waitForTransaction(txHash);

      const events = contract.parseEvents(txResult);

      const rec = events[0]["mini::Mini::MintToken"].receiver;
      const amn = events[0]["mini::Mini::MintToken"].amount;

      const hex_it = "0x" + rec.toString(16);

      toast.success(
        `${BigNumber(amn).toString()} tokens minted to ${hex_it} successfully`
      );
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};

export const transfer = async (account, ABI, provider, rc, at, toast) => {
  if (account) {
    try {
      const contract = stateChangeContract(account, ABI);

      const res = await contract.transfer(rc, at);

      const txHash = res?.transaction_hash;

      const txResult = await provider.waitForTransaction(txHash);

      const events = contract.parseEvents(txResult);

      const rec = events[0]["mini::Mini::TransferToken"].receiver;
      const amn = events[0]["mini::Mini::TransferToken"].amount;

      const hex_it = "0x" + rec.toString(16);

      toast.success(
        `${BigNumber(
          amn
        ).toString()} tokens has been transferred to ${hex_it} successfully`
      );
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  }
};
