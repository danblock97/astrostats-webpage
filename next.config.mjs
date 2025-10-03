/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
