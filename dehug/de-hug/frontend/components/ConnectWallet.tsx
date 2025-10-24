"use client";

import { thirdwebClient, wallets } from "../app/client";
import { useEffect, useState } from "react";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { useChainSwitch } from "../hooks/useChainSwitch";
import { baseSepolia } from "../constants/chain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ConnectWalletProps {
  onConnect?: () => void;
  label?: string;
}

const ConnectWallet = ({ onConnect, label = "Connect Wallet" }: ConnectWalletProps) => {
  const [mounted, setMounted] = useState(false);
  const account = useActiveAccount();
  const [prevAccount, setPrevAccount] = useState<Account | undefined>(undefined);
  const [basename, setBasename] = useState<string | null>(null);
  const [isLoadingBasename, setIsLoadingBasename] = useState(false);
  const { isOnCorrectChain, switchToLiskSepolia } = useChainSwitch();

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://dehug.vercel.app";
      
  const metadata = {
    name: "DeHug",
    description: "Decentralized Machine Learning Hub",
    url: origin,
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Basename when wallet connects
  useEffect(() => {
    const fetchBasename = async () => {
      if (!account?.address) {
        setBasename(null);
        return;
      }

      setIsLoadingBasename(true);
      try {
        // Query Base Sepolia testnet for basename
        const response = await fetch(
          `https://api.basename.app/v1/names?address=${account.address}&chainId=84532`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.names && data.names.length > 0) {
            setBasename(data.names[0]);
          } else {
            setBasename(null);
          }
        }
      } catch (error) {
        console.error("Error fetching basename:", error);
        setBasename(null);
      } finally {
        setIsLoadingBasename(false);
      }
    };

    fetchBasename();
  }, [account?.address]);

  useEffect(() => {
    if (account && !prevAccount && onConnect) {
      onConnect();
    }
    setPrevAccount(account);
  }, [account, prevAccount, onConnect]);

  // Auto-switch to correct chain when wallet connects
  useEffect(() => {
    if (account && !isOnCorrectChain) {
      const timer = setTimeout(() => {
        switchToLiskSepolia();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [account, isOnCorrectChain, switchToLiskSepolia]);

  const openBasenameRegistration = () => {
    window.open("https://www.base.org/names", "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3 justify-end self-end">
      {/* Show Basename info when connected */}
      {account && (
        <div className="hidden md:flex items-center gap-2">
          {isLoadingBasename ? (
            <Badge variant="outline" className="border-slate-600 text-slate-400 bg-slate-900/50">
              Loading...
            </Badge>
          ) : basename ? (
            <Badge variant="outline" className="border-blue-600 text-blue-400 bg-blue-950/50">
              {basename}
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={openBasenameRegistration}
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white font-light"
            >
              Get Basename
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          )}
        </div>
      )}

      <div className="hidden md:flex">
        <ConnectButton 
          client={thirdwebClient}
          appMetadata={metadata}
          connectButton={{ label }}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          chain={baseSepolia}
          chains={[baseSepolia]}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "hsl(var(--primary))",
            },
          })}
        />
      </div>
      <div className="md:hidden flex">
        <ConnectButton 
          client={thirdwebClient}
          appMetadata={metadata}
          connectButton={{ label }}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          chain={baseSepolia}
          chains={[baseSepolia]}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "hsl(var(--primary))",
            },
          })}
        />
      </div>
    </div>
  );
};

export default ConnectWallet;
