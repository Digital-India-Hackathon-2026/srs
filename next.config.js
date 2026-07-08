/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // /public is served locally — no remote patterns needed
    unoptimized: false,
  },
};

module.exports = nextConfig;
