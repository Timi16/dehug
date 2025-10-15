"use client";

import { getContract, readContract } from "thirdweb";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { useLoading } from "../useLoading";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

interface ContentMetadata {
  name?: string;
  description?: string;
  image?: string;
  properties?: {
    category?: string;
    task?: string;
    size?: string;
    format?: string;
    tags?: string[];
    license?: string;
    framework?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const useGetContentMetadata = (tokenId: number) => {
  const { isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);

  const fetchContentMetadata = useCallback(async () => {
    if (tokenId <= 0) return;

    startLoading();
    setError(null);

    try {
      const contract = getContract({
        client: thirdwebClient,
        chain: baseSepolia,
        address: process.env.DEHUG_ADDRESS as string,
      });

      const metadataHash = await readContract({
        contract,
        method: "function getContentMetadata(uint256 _tokenId) view returns (string memory)",
        params: [BigInt(tokenId)],
      });

      let fetchedMetadata: ContentMetadata = {};
      if (metadataHash) {
        const metadataUrl = `${IPFS_GATEWAY}${metadataHash}`;
        const response = await fetch(metadataUrl);
        if (response.ok) {
          fetchedMetadata = await response.json();
        } else {
          throw new Error("Failed to fetch metadata from IPFS");
        }
      }

      setMetadata(fetchedMetadata);
    } catch (err) {
      console.error("Error fetching content metadata:", err);
      setError("Failed to fetch content metadata");
      toast.error("Error fetching content metadata");
    } finally {
      stopLoading();
    }
  }, [tokenId]);

  useEffect(() => {
    if (isConnected) {
      fetchContentMetadata();
    }
  }, [isConnected, fetchContentMetadata]);

  return { metadata, isLoading, error, refetch: fetchContentMetadata };
};

export default useGetContentMetadata;