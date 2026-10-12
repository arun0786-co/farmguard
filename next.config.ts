import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // pdf-parse uses pdf.js, it works better when next does not bundle it
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
