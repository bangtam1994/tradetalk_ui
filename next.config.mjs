/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['s.tradingview.com', 'www.tradingview.com'],
  },
};

export default nextConfig;
