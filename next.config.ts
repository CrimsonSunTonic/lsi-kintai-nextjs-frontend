import os from 'os';
import { config } from 'process';

function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue; // ✅ skip undefined interfaces

    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(`http://${net.address}:3000`);
      }
    }
  }

  return ips;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.IP_HOST_URL,
    ...getLocalIPs(),
  ],
};

console.log('✅ Allowed dev origins:', nextConfig.allowedDevOrigins);

export default nextConfig;
