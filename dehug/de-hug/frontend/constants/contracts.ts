import { ethers } from "ethers";
import DeHugIncentivesABI from "./abi/DeHugIncentivesABI.json";

export const getGigContract = (providerOrSigner: ethers.Provider | ethers.Signer) =>
  new ethers.Contract(
    process.env.DEHUG_ADDRESS as string,
    DeHugIncentivesABI,
    providerOrSigner
  );