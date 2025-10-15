"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify';
import { useChainId, useAccount } from "../../lib/thirdweb-hooks";
import { useChainSwitch } from "../useChainSwitch";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

const useUpdateDownloadCount = () => {
    const chainId = useChainId();
    const account = useActiveAccount();
    const { isConnected } = useAccount();
    const { ensureCorrectChain } = useChainSwitch();

    return useCallback(
        async (tokenId: number, downloadCount: number) => {
            if (!account) {
                toast.warning("Please connect your wallet first.");
                return false;
            }

            if (!isConnected) {
                toast.warning("Please connect your wallet first.");
                return false;
            }
            
            const isCorrectChain = await ensureCorrectChain();
            if (!isCorrectChain) {
                return false;
            }

            if (tokenId <= 0 || downloadCount <= 0) {
                toast.error("Invalid token ID or download count.");
                return false;
            }

            try {
                const contract = getContract({
                    client: thirdwebClient,
                    chain: baseSepolia,
                    address: process.env.DEHUG_ADDRESS as string,
                });

                const transaction = prepareContractCall({
                    contract,
                    method: "function updateDownloadCount(uint256 _tokenId, uint256 _downloadCount)",
                    params: [BigInt(tokenId), BigInt(downloadCount)],
                });

                toast.info("Updating download count...");

                const result = await sendTransaction({
                    transaction,
                    account,
                });

                toast.success("Download count updated successfully!");
                
                return {
                    success: true,
                    transactionHash: result.transactionHash,
                };
                
            } catch (error) {
                const err = error as ErrorWithReason;
                let errorMessage = "An error occurred while updating download count.";
                
                if (err.reason === "Token does not exist") {
                    errorMessage = "Content not found.";
                } else if (err.reason === "Content is not active") {
                    errorMessage = "Content is no longer active.";
                } else if (err.reason === "Not owner") {
                    errorMessage = "Only the content owner can update download count.";
                }
                
                toast.error(errorMessage);
                console.error("Update download count error:", error);
                return false;
            }
        },
        [chainId, isConnected, account, ensureCorrectChain]
    );
};

export default useUpdateDownloadCount;