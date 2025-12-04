import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@mui/x-data-grid",
    "@mui/x-internals",
    "@mui/material",
    "@mui/system",
  ],
  experimental: {
    optimizePackageImports: ["@mui/x-data-grid", "@mui/material", "lucide-react"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /node_modules\/@mui\/x-internals\/.*\.js$/,
      type: "javascript/auto",
    });
    return config;
  },
};

export default nextConfig;