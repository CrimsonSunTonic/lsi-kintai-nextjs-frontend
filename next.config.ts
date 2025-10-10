import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    // You can include your LAN subnet if needed
    'http://192.168.1.0:3000',
    'http://192.168.1.1:3000',
    'http://192.168.1.2:3000',
    'http://192.168.1.3:3000',
    'http://192.168.1.4:3000',
    'http://192.168.1.5:3000',
  ],
};

export default nextConfig;
