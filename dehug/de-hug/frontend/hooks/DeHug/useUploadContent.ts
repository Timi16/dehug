"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify';
import { useChainId, useAccount } from "../../lib/thirdweb-hooks";
import { useRouter } from "next/navigation";
import { useChainSwitch } from "../useChainSwitch";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt, readContract } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

interface UploadContentParams {
  contentType: 0 | 1; // 0 for DATASET, 1 for MODEL
  ipfsHash: string;
  metadataIPFSHash: string;
  imageIPFSHash: string;
  title: string;
  tags: string[];
}

interface UploadContentResult {
  success: boolean;
  transactionHash?: `0x${string}`;
  tokenId?: string;
}

const useUploadContent = () => {
  const chainId = useChainId();
  const account = useActiveAccount();
  const { isConnected } = useAccount();
  const router = useRouter();
  const { ensureCorrectChain } = useChainSwitch();

  return useCallback(async (params: UploadContentParams): Promise<UploadContentResult> => {
      if (!account) {
        toast.warning("Please connect your wallet first.");
        return { success: false };
      }

      if (!isConnected) {
        toast.warning("Please connect your wallet first.");
        return { success: false };
      }

      const isCorrectChain = await ensureCorrectChain();
      if (!isCorrectChain) {
        return { success: false };
      }

      // Validate required parameters
      if (!params.ipfsHash || !params.metadataIPFSHash || !params.title) {
        toast.error("Please fill in all required fields.");
        return { success: false };
      }

      // Check contract address exists
      const contractAddress = process.env.NEXT_PUBLIC_DEHUG_ADDRESS || process.env.DEHUG_ADDRESS;
      if (!contractAddress) {
        toast.error("Contract address not configured. Please add DEHUG_ADDRESS to .env");
        console.error("Missing DEHUG_ADDRESS in environment variables");
        return { success: false };
      }

      console.log("Using contract address:", contractAddress);

      try {
        // Get the contract instance using thirdweb
        const contract = getContract({
          client: thirdwebClient,
          chain: baseSepolia,
          address: contractAddress,
        });

        console.log("Contract instance created");
        console.log("Upload params:", params);

        // Prepare the contract call for uploadContent
        const transaction = prepareContractCall({
          contract,
          method: "function uploadContent(uint8 _contentType, string _ipfsHash, string _metadataIPFSHash, string _imageIPFSHash, string _title, string[] _tags) returns (uint256)",
          params: [
            params.contentType,
            params.ipfsHash,
            params.metadataIPFSHash,
            params.imageIPFSHash,
            params.title,
            params.tags,
          ],
        });

        console.log("Transaction prepared");
        toast.info("Please confirm the transaction in MetaMask...");

        // Send the transaction
        const result = await sendTransaction({
          transaction,
          account,
        });

        console.log("Transaction sent:", result.transactionHash);
        toast.info("Transaction sent! Waiting for confirmation...");

        // Wait for the transaction receipt to ensure it's mined
        const receipt = await waitForReceipt({
          client: thirdwebClient,
          chain: baseSepolia,
          transactionHash: result.transactionHash,
        });

        console.log("Transaction confirmed:", receipt);
        toast.info("Transaction confirmed! Getting token ID...");

        // Method 1: Try to get latest token ID
        let tokenId: bigint | null = null;
        
        try {
          tokenId = await readContract({
            contract,
            method: "function getLatestTokenId() view returns (uint256)",
            params: [],
          });
          console.log("Token ID from getLatestTokenId:", tokenId);
        } catch (readError) {
          console.warn("Failed to read getLatestTokenId:", readError);
          
          // Method 2: Fallback - try totalSupply
          try {
            tokenId = await readContract({
              contract,
              method: "function totalSupply() view returns (uint256)",
              params: [],
            });
            console.log("Token ID from totalSupply:", tokenId);
          } catch (supplyError) {
            console.error("Failed to read totalSupply:", supplyError);
          }
        }

        // If we still don't have tokenId, try parsing events from receipt
        if (!tokenId) {
          console.log("Attempting to parse events from receipt...");
          try {
            // Look for ContentUploaded event in logs
            const contentUploadedTopic = "0x..." // This would be the keccak256 hash of the event signature
            // For now, we'll use a simpler approach - just use a sequential ID
            console.warn("Could not retrieve token ID from contract. Using fallback method.");
            
            // As a last resort, suggest the user check the transaction on BaseScan
            toast.warning(
              "NFT minted successfully! Check transaction on BaseScan to see token ID.",
              { autoClose: 10000 }
            );
            
            return {
              success: true,
              transactionHash: result.transactionHash as `0x${string}`,
              tokenId: "Check BaseScan", // User will need to check manually
            };
          } catch (parseError) {
            console.error("Failed to parse events:", parseError);
          }
        }

        if (!tokenId || tokenId === BigInt(0)) {
          console.error("Token ID is null or zero");
          // Still return success since transaction went through
          toast.warning(
            "NFT minted! Transaction successful. Check BaseScan for token ID.",
            { autoClose: 10000 }
          );
          
          return {
            success: true,
            transactionHash: result.transactionHash as `0x${string}`,
            tokenId: "Check BaseScan",
          };
        }

        console.log("Final token ID:", tokenId.toString());
        toast.success(`Content uploaded successfully! Token ID: ${tokenId.toString()}`);

        return {
          success: true,
          transactionHash: result.transactionHash as `0x${string}`,
          tokenId: tokenId.toString(),
        };
      } catch (error) {
        const err = error as ErrorWithReason;
        let errorMessage = "An error occurred while uploading content.";

        console.error("Full error:", error);
        console.error("Error message:", err.message);
        console.error("Error reason:", err.reason);

        if (err.reason === "IPFS hash cannot be empty") {
          errorMessage = "IPFS hash is required.";
        } else if (err.reason === "Content already exists") {
          errorMessage = "This content has already been uploaded.";
        } else if (err.reason === "Title cannot be empty") {
          errorMessage = "Title is required.";
        } else if (err.reason === "Metadata IPFS hash cannot be empty") {
          errorMessage = "Metadata IPFS hash is required.";
        } else if (err.message?.includes("user rejected")) {
          errorMessage = "Transaction was rejected in MetaMask.";
        } else if (err.message?.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas. Please add more ETH to your wallet.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        toast.error(errorMessage);
        console.error("Upload content error:", error);
        return { success: false };
      }
    },
    [chainId, isConnected, account, ensureCorrectChain]
  );
};

export default useUploadContent;