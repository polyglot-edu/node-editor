/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

const CURRENT_HOST = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : 'http://localhost:3000';
const BACK_URL = process.env.BACK_URL || 'http://localhost:5000';

module.exports = {
  env: {
    CURRENT_HOST: CURRENT_HOST,
    BACK_URL: BACK_URL,
  },
};
