/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ipis-sitwap2.bdrtsy.net/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
