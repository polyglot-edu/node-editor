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

const AUTH0_SECRET = process.env.AUTH0_SECRET;
const AUTH0_BASE_URL = process.env.AUTH0_BASE_URL || CURRENT_HOST;
const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_SCOPE = process.env.AUTH0_SCOPE;

module.exports = {
  env: {
    CURRENT_HOST: CURRENT_HOST,
    BACK_URL: BACK_URL,
    AUTH0_SECRET: AUTH0_SECRET,
    AUTH0_BASE_URL: AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: AUTH0_AUDIENCE,
    AUTH0_SCOPE: AUTH0_SCOPE,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/flows',
        permanent: true,
      },
    ];
  },
};
