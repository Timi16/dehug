"use client";

import { getContract, readContract } from "thirdweb";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import { useLoading } from "../useLoading";
import { thirdwebClient } from "@/app/client";
import { baseSepolia } from "@/constants/chain";

interface UserStats {
  totalPoints: number;
  reputationScore: number;
  isPremiumContributor: boolean;
  contentCount: number;
}

const useGetUserStats = (userAddress: string) => {
  const { isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const fetchUserStats = useCallback(async () => {
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
        method: "function getUserStats(address _user) view returns (uint256 totalPoints, uint256 reputationScore, bool isPremiumContributor, uint256 contentCount)",
        params: [userAddress],
      });
      
      const stats: UserStats = {
        totalPoints: Number(result[0]),
        reputationScore: Number(result[1]),
        isPremiumContributor: result[2] as boolean,
        contentCount: Number(result[3]),
      };

      setUserStats(stats);
    } catch (err) {
      console.error("Error fetching user stats:", err);
      setError("Failed to fetch user stats");
      toast.error("Error fetching user stats");
    } finally {
      stopLoading();
    }
  }, [userAddress]);

  useEffect(() => {
    fetchUserStats();
  }, [isConnected]);

  return { userStats, isLoading, error, refetch: fetchUserStats };
};

export default useGetUserStats;