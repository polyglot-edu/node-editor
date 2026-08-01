/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Emits .next/standalone so the runtime image can ship without node_modules.
  output: 'standalone',
  // NOTE: values listed here are inlined into the bundle at BUILD time, so they
  // can never hold secrets and cannot be changed by the runtime environment.
  // TEST_MODE is here because client components read it, and it must therefore
  // be passed as a build arg. Everything else (NEXTAUTH_*, GOOGLE_*, BACK_URL)
  // is read from process.env in server-only code and stays out of this block.
  env: {
    TEST_MODE: process.env.TEST_MODE,
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

module.exports = nextConfig;
