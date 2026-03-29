import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // xlsx y jszip usan módulos de Node.js que no existen en el browser.
  // Este fallback le dice al bundler que ignore esos módulos al compilar para el cliente.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
    };
    return config;
  },
};

export default nextConfig;
