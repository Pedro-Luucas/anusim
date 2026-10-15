import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/logo.jpg" },
      { pathname: "/shulphotos/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/pages/calendario",
        destination: "/calendario",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
