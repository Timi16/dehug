"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify'
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWallet, useActiveWalletChain } from "thirdweb/react";
import { baseSepolia, SUPPORTED_CHAIN_ID } from "@/constants/chain";

export const useChainSwitch = () => {
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const isOnCorrectChain = activeChain?.id === SUPPORTED_CHAIN_ID;

  const switchToLiskSepolia = useCallback(async () => {
    if (!wallet) {
      toast.error("No wallet connected");
      return false;
    }

    if (isOnCorrectChain) {
      return true;
    }

    try {
      await switchChain(baseSepolia);
      toast.success("Successfully switched to Lisk Sepolia");
      return true;
    } catch (error) {
      console.error("Failed to switch chain:", error);
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.message.includes("rejected")) {
          toast.info("Chain switch cancelled by user");
        } else if (error.message.includes("Unrecognized chain")) {
          toast.error("Please add Lisk Sepolia network to your wallet manually");
        } else {
          toast.error(`Failed to switch network: ${error.message}`);
        }
      } else {
        toast.error("Failed to switch to Lisk Sepolia network");
      }
      
      return false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, isOnCorrectChain]);

  const ensureCorrectChain = useCallback(async () => {
    if (!wallet) {
      toast.warning("Please connect your wallet first");
      return false;
    }

    if (!isOnCorrectChain) {
      toast.warning("Please switch to Lisk Sepolia network");
      return await switchToLiskSepolia();
    }

    return true;
  }, [wallet, isOnCorrectChain, switchToLiskSepolia]);

  return {
    isOnCorrectChain,
    switchToLiskSepolia,
    ensureCorrectChain,
    currentChainId: activeChain?.id,
  };
};