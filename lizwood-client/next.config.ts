import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com", "placecats.com"]
  }
};

export default nextConfig;
