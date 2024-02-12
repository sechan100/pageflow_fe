/** @type {import('next').NextConfig} */
const nextConfig = {

  async rewrites() { // production에서는 사용하지 않음 / proxy 설정
    return [
      {
        source: '/:path*',
        destination: `http://localhost:8888/:path*`,
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

