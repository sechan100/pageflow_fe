/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `http://localhost:8888/:path*`,
      },
    ];
  },
};

export default nextConfig;

