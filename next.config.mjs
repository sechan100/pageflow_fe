/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() { // proxy 설정
    return [
      {
        source: `${process.env.NEXT_PUBLIC_API_PREFIX}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_API_HOST}/:path*`,
      },
    ];
  },

  webpack: (config, { dev }) => { // 웹팩 컴파일 설정
    if (!dev) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 콘솔 로그 제거
            },
          },
        }),
      ];
    }
    return config;
  }

};

export default nextConfig;

