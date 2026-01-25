import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   useCache: true,
  //   cpus: 1,
  //   workerThreads: false
  // },
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: '/images/**'
      }
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'okryme.ru',
        pathname: '/wp-content/**'
      }
    ]
  }
};

export default nextConfig;
