/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    DEHUG_ADDRESS: process.env.DEHUG_ADDRESS,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    PINATA_URL: process.env.PINATA_URL,
    PINATA_JWT: process.env.PINATA_JWT,
  },
};

export default nextConfig;
