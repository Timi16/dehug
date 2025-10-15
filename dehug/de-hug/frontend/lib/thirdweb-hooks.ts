import { 
  useActiveAccount, 
  useActiveWallet, 
  useActiveWalletChain 
} from "thirdweb/react";
import { signMessage } from "thirdweb/utils";
import { useCallback } from "react";
// import type { Account } from "thirdweb/wallets";

// Types for better type safety
interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
  salt?: string;
}

interface TypedDataField {
  name: string;
  type: string;
}

interface TypedDataMessage {
  [key: string]: unknown;
}

interface TypedDataPayload {
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  primaryType: string;
  message: TypedDataMessage;
}

// Custom hook to mimic useAccount
export const useAccount = () => {
  const account = useActiveAccount();
  return {
    address: account?.address,
    isConnected: !!account,
    account,
  };
};

// Custom hook to mimic useChainId
export const useChainId = () => {
  const activeChain = useActiveWalletChain();
  return activeChain?.id;
};

// Custom hook to mimic useSignMessage
export const useSignMessage = () => {
  const account = useActiveAccount();
  
  const signMessageAsync = useCallback(async (message: string) => {
    if (!account) throw new Error("No account connected");
    return await signMessage({ message, account });
  }, [account]);

  return { signMessageAsync };
};

// Custom hook to mimic useSignTypedData - Fixed version
export const useSignTypedData = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  
  const signTypedDataAsync = useCallback(async (typedData: TypedDataPayload) => {
    if (!account || !wallet) throw new Error("No account or wallet connected");
    
    try {
      // Try using wallet's native signTypedData if available
      if ('signTypedData' in wallet && typeof wallet.signTypedData === 'function') {
        return await wallet.signTypedData(typedData);
      }
      
      // Fallback: Manual EIP-712 signing
      const { ethers } = await import('ethers');
      
      // Encode domain separator
      const domainHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
          [
            ethers.keccak256(ethers.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
            ethers.keccak256(ethers.toUtf8Bytes(typedData.domain.name || '')),
            ethers.keccak256(ethers.toUtf8Bytes(typedData.domain.version || '')),
            typedData.domain.chainId || 1,
            typedData.domain.verifyingContract || ethers.ZeroAddress
          ]
        )
      );
      
      // Encode message hash (example for Permit type)
      const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
          [
            ethers.keccak256(ethers.toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')),
            typedData.message.owner,
            typedData.message.spender,
            typedData.message.value,
            typedData.message.nonce,
            typedData.message.deadline
          ]
        )
      );
      
      // Create final digest
      const digest = ethers.keccak256(
        ethers.concat(['0x1901', domainHash, messageHash])
      );
      
      // Sign the digest
      if ('signMessage' in wallet && typeof wallet.signMessage === 'function') {
        return await wallet.signMessage(ethers.getBytes(digest));
      }
      
      throw new Error('Wallet does not support required signing methods');
      
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw new Error(`Failed to sign typed data: ${(error as Error).message}`);
    }
  }, [account, wallet]);

  return { signTypedDataAsync };
};

// Custom hook to mimic useAppKitProvider
export const useAppKitProvider = () => {
  const wallet = useActiveWallet();
  return { walletProvider: wallet };
};

// Utility function to check if wallet supports a method
export const walletSupports = (wallet: never, method: string): boolean => {
  return wallet && method in wallet && typeof wallet[method] === 'function';
};