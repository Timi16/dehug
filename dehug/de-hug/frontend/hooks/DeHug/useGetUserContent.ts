"use client";

import { getContract, readContract } from "thirdweb";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { useLoading } from "../useLoading";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

const useGetUserContent = (userAddress: string) => {
  const { isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [userContent, setUserContent] = useState<number[]>([]);

  const fetchUserContent = useCallback(async () => {
    if (!userAddress) return;

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
        method: "function getUserContent(address _user) view returns (uint256[] memory)",
        params: [userAddress],
      });
      
      // Convert BigInt array to number array
      const contentIds = (result as bigint[]).map((id: bigint) => Number(id));
      setUserContent(contentIds);
    } catch (err) {
      console.error("Error fetching user content:", err);
      setError("Failed to fetch user content");
      toast.error("Error fetching user content");
    } finally {
      stopLoading();
    }
  }, [userAddress]);

  useEffect(() => {
    fetchUserContent();
  }, [isConnected]);

  return { userContent, isLoading, error, refetch: fetchUserContent };
};

export default useGetUserContent;