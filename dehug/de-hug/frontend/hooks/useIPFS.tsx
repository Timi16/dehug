import axios from "axios";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useLoading } from "./useLoading";

export const useIPFS = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  // Upload any data (string, object, or file) to IPFS
  const uploadToIPFS = async (data: string | object | File): Promise<string> => {
    try {
      startLoading();
      
      let file: File;
      
      // Handle different data types
      if (data instanceof File) {
        file = data;
      } else {
        const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
        const blob = new Blob([jsonData], { type: 'application/json' });
        file = new File([blob], 'data.json', { type: 'application/json' });
      }

      const formData = new FormData();
      formData.append("file", file);

      const pinata_api = process.env.PINATA_API_KEY;
      const pinata_secret = process.env.PINATA_SECRET_API_KEY;

      if (!pinata_api || !pinata_secret) {
        throw new Error("Pinata API keys not configured");
      }

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: pinata_api,
            pinata_secret_api_key: pinata_secret,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const fileUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      
      toast.success("Successfully uploaded to IPFS!");
      return fileUrl;
      
    } catch (error) {
      toast.error("Error uploading to IPFS");
      console.error("IPFS upload error:", error);
      throw error;
    } finally {
      stopLoading();
    }
  };

  const fetchFromIPFS = async (ipfsURL: string) => {
    try {
      // Multiple gateway fallback strategy
      const gateways = [
        'https://gateway.pinata.cloud/ipfs/',
      ];

      // Extract IPFS hash from any gateway URL
      const extractHash = (url: string) => {
        const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
        return match ? match[1] : url;
      };

      const ipfsHash = extractHash(ipfsURL);

      for (const gateway of gateways) {
        try {
          const fullUrl = gateway + ipfsHash;
          console.log(`Trying gateway: ${fullUrl}`);
          
          const response = await axios.get(fullUrl, {
            timeout: 10000, // 10 second timeout per gateway
            headers: {
              'Accept': 'application/json, text/plain, */*'
            }
          });
          
          console.log(`Successfully fetched from: ${fullUrl}`);
          return response.data;
          
        } catch (gatewayError) {
          console.log(`Gateway failed: ${gateway}`, gatewayError);
          continue; // Try next gateway
        }
      }

      throw new Error('All IPFS gateways failed');
      
    } catch (error) {
      toast.error("Error fetching from IPFS");
      console.error("IPFS fetch error:", error);
      throw error;
    }
  };

  // Helper function to get just the IPFS hash
  const getIPFSHash = (ipfsURL: string): string => {
    const match = ipfsURL.match(/\/ipfs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : ipfsURL;
  };

  // Helper function to convert hash to different gateway
  const toGateway = (ipfsHash: string, gateway: string = 'https://ipfs.io/ipfs/'): string => {
    const hash = getIPFSHash(ipfsHash);
    return gateway + hash;
  };

  return {
    uploadToIPFS,
    fetchFromIPFS,
    getIPFSHash,
    toGateway,
    isLoading,
  };
};

export default useIPFS;