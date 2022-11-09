/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

const CURRENT_HOST = process.env.HEROKU_APP_NAME
  ? 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com'
  : 'http://localhost:3000';
const BACK_URL = process.env.BACK_URL || 'http://localhost:5000';

module.exports = {
  env: {
    CURRENT_HOST: CURRENT_HOST,
    BACK_URL: BACK_URL,
  },
};
