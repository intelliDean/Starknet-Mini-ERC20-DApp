import { shortString } from "starknet";
import { BigNumber } from "bignumber.js";

export const convertFelt252ToString = (felt252) => {
  try {
    const bn = BigNumber(felt252);
    const hex_it = "0x" + bn.toString(16);

    return shortString.decodeShortString(hex_it);
  } catch (error) {
    console.log("Error: " + error);
  }
};
