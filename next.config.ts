import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
