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
        hostname: 'ay-petry.ru',
        pathname: '/images/**',
        port: ''
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/wp-content/**',
        port: '9000'
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        // ...Next.js лезет в MinIO, берет её и отдает пользователю.
        // URL в браузере НЕ меняется.
        destination: 'http://127.0.0.1:9000/wp-content/uploads/:path*'
      }
    ];
  }
};

export default nextConfig;
