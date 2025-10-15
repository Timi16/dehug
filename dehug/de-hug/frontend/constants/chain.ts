import { defineChain } from "thirdweb";

// Define Base Sepolia chain
export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://sepolia.base.org",
  blockExplorers: [
    {
      name: "BaseScan",
      url: "https://sepolia.basescan.org",
    },
  ],
  testnet: true,
});

export const SUPPORTED_CHAIN_ID = 84532;

export const isSupportedChain = (
  chainId: number | undefined
): chainId is number =>
  chainId !== undefined && Number(chainId) === SUPPORTED_CHAIN_ID;