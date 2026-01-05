/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**', 
      },
      // Add this block if you deploy Strapi to a real server later (e.g. cloud)
      // {
      //   protocol: 'https',
      //   hostname: 'your-strapi-domain.com',
      // }
    ],
  },
};

export default nextConfig;