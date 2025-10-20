"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify';
import { useActiveAccount } from "thirdweb/react";
import { useChainSwitch } from "../useChainSwitch";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt, readContract } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";
import { ethers } from 'ethers'; // Add: npm i ethers for TransferSingle decode

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
  explorerUrl?: string;
}

const useUploadContent = () => {
  const account = useActiveAccount();
  const { ensureCorrectChain } = useChainSwitch();

  // BaseScan URL helper
  const getExplorerUrl = (txHash: `0x${string}`) => 
    `https://sepolia.basescan.org/tx/${txHash}`;

  return useCallback(async (params: UploadContentParams): Promise<UploadContentResult> => {
    if (!account) {
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

    // Contract address (prefer public env)
    const contractAddress = process.env.NEXT_PUBLIC_DEHUG_ADDRESS || process.env.DEHUG_ADDRESS;
    if (!contractAddress) {
      toast.error("Contract address not configured. Please add DEHUG_ADDRESS to .env");
      console.error("Missing DEHUG_ADDRESS");
      return { success: false };
    }

    console.log("Using contract address:", contractAddress);
    console.log("Upload params:", params);

    const loadingToast = toast.loading("Uploading content... Please confirm in wallet.");

    try {
      // Get contract
      const contract = getContract({
        client: thirdwebClient,
        chain: baseSepolia,
        address: contractAddress,
      });

      // Prepare tx
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

      // Send tx
      const result = await sendTransaction({
        transaction,
        account,
      });

      toast.update(loadingToast, { 
        render: "Transaction sent! Waiting for confirmation...", 
        type: "info", 
        isLoading: true 
      });

      // Wait for receipt
      const receipt = await waitForReceipt({
        client: thirdwebClient,
        chain: baseSepolia,
        transactionHash: result.transactionHash,
      });

      toast.update(loadingToast, { 
        render: "Transaction confirmed! Fetching token ID...", 
        type: "info", 
        isLoading: true 
      });

      console.log("Transaction confirmed:", receipt);

      // Parse tokenId: Events first (reliable), then reads
      let tokenId: string | null = null;

      // Method 1: ContentUploaded event (custom, from your ABI)
      const contentUploadedTopic = "0xaf9112b14cab444584e1c1760596128c324b98422facac9ee00a830d560bf775"; // keccak256("ContentUploaded(uint256,address,uint8,string,string)")
      try {
        const event = receipt.logs.find(log => 
          log.topics[0] === contentUploadedTopic &&
          log.address.toLowerCase() === contractAddress.toLowerCase()
        );

        if (event && event.topics[1]) {
          tokenId = BigInt(event.topics[1]).toString(); // tokenId is topics[1] (indexed)
          console.log("Token ID from ContentUploaded event:", tokenId);
        }
      } catch (parseError) {
        console.warn("ContentUploaded parsing failed:", parseError);
      }

      // Method 2: TransferSingle event (ERC1155 mint fallback)
      if (!tokenId) {
        const transferSingleTopic = "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
        const zeroAddressPadded = "0x0000000000000000000000000000000000000000000000000000000000000000"; // 0x0 padded to 32 bytes

        try {
          const transferEvent = receipt.logs.find((log) => 
            log.topics[0] === transferSingleTopic &&
            log.topics[2] === zeroAddressPadded &&  // from == 0x0 (topics[2])
            log.address.toLowerCase() === contractAddress.toLowerCase()
          );

          if (transferEvent) {
            // Decode non-indexed data: id (uint256) + value (uint256), ABI-encoded
            const iface = new ethers.Interface(['event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)']);
            const parsedLog = iface.parseLog(transferEvent);
            if (parsedLog && parsedLog.args.id) {
              tokenId = parsedLog.args.id.toString();
              console.log("Token ID from TransferSingle event:", tokenId);
            }
          }
        } catch (parseError) {
          console.warn("TransferSingle parsing failed:", parseError);
        }
      }

      // Method 3: getLatestTokenId (your original)
      if (!tokenId) {
        try {
          const latestId = await readContract({
            contract,
            method: "function getLatestTokenId() view returns (uint256)",
            params: [],
          });
          tokenId = latestId.toString();
          console.log("Token ID from getLatestTokenId:", tokenId);
        } catch (readError) {
          console.warn("Failed to read getLatestTokenId:", readError);
        }
      }

      // Method 4: totalSupply fallback (your original, assume latest = supply)
      if (!tokenId) {
        try {
          const supply = await readContract({
            contract,
            method: "function totalSupply() view returns (uint256)",
            params: [],
          });
          tokenId = supply.toString(); // Sequential IDs
          console.log("Token ID from totalSupply:", tokenId);
        } catch (supplyError) {
          console.error("Failed to read totalSupply:", supplyError);
        }
      }

      // Final fallback
      if (!tokenId || tokenId === "0") {
        console.warn("Could not fetch token ID automatically.");
        const explorerUrl = getExplorerUrl(result.transactionHash);
        toast.update(loadingToast, { 
          render: `NFT minted! View on BaseScan: ${explorerUrl}`, 
          type: "warning", 
          isLoading: false,
          autoClose: 10000
        });
        
        return {
          success: true,
          transactionHash: result.transactionHash,
          tokenId: "Check BaseScan",
          explorerUrl,
        };
      }

      toast.update(loadingToast, { 
        render: `Content uploaded successfully! Token ID: ${tokenId}`, 
        type: "success", 
        isLoading: false,
        autoClose: 5000
      });

      return {
        success: true,
        transactionHash: result.transactionHash,
        tokenId,
      };
    } catch (error) {
      const err = error as ErrorWithReason;
      console.error("Upload error:", error);

      let errorMessage = "An error occurred while uploading content.";
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

      toast.update(loadingToast, { 
        render: errorMessage, 
        type: "error", 
        isLoading: false 
      });

      return { success: false };
    }
  }, [account, ensureCorrectChain]); // Optimized deps
};

export default useUploadContent;