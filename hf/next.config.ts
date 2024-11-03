import type { NextConfig } from "next";
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone', // Feel free to modify/remove this option

    // Override the default webpack configuration
 
    serverExternalPackages: ['@huggingface/transformers'],
};

export default nextConfig;
