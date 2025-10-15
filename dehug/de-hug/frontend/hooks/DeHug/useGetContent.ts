"use client";

import { getContract, readContract } from "thirdweb";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { useLoading } from "../useLoading";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

interface ContentData {
  uploader: string;
  contentType: number; // 0 for DATASET, 1 for MODEL
  ipfsHash: string;
  title: string;
  description: string;
  qualityTier: number; // 0 for BASIC, 1 for PREMIUM, 2 for VERIFIED
  downloadCount: number;
  totalPointsEarned: number;
  uploadTimestamp: number;
  isActive: boolean;
}

const useGetContent = (tokenId: number) => {
  const { isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [contentData, setContentData] = useState<ContentData | null>(null);

  const fetchContentDetails = useCallback(async () => {
    if (tokenId <= 0) return;

    startLoading();
    setError(null);

    try {
      const contract = getContract({
        client: thirdwebClient,
        chain: baseSepolia,
        address: process.env.DEHUG_ADDRESS as string,
      });

      const result = await readContract({
        contract: contract,
        method: "function getContent(uint256 _tokenId) view returns (address uploader, uint8 contentType, string memory ipfsHash, string memory title, string memory description, uint8 qualityTier, uint256 downloadCount, uint256 totalPointsEarned, uint256 uploadTimestamp, bool isActive)",
        params: [BigInt(tokenId)],
      });
      
      const content: ContentData = {
        uploader: result[0] as string,
        contentType: Number(result[1]),
        ipfsHash: result[2] as string,
        title: result[3] as string,
        description: result[4] as string,
        qualityTier: Number(result[5]),
        downloadCount: Number(result[6]),
        totalPointsEarned: Number(result[7]),
        uploadTimestamp: Number(result[8]),
        isActive: result[9] as boolean,
      };

      setContentData(content);
    } catch (err) {
      console.error("Error fetching content details:", err);
      setError("Failed to fetch content details");
      toast.error("Error fetching content details");
    } finally {
      stopLoading();
    }
  }, [tokenId]);

  useEffect(() => {
    fetchContentDetails();
  }, [isConnected]);

  return { contentData, isLoading, error, refetch: fetchContentDetails };
};

export default useGetContent;