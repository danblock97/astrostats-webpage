/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
  // Mark MongoDB as external to avoid bundling issues with Next.js 16
  serverExternalPackages: ['mongodb'],
};

export default nextConfig;
