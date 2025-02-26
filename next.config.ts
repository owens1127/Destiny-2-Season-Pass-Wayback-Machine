import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "www.bungie.net",
        pathname: "/img/destiny_content/pgcr/*",
      },
      {
        hostname: "www.bungie.net",
        pathname: "/img/theme/destiny/bgs/pgcrs/placeholder.jpg",
      },
    ],
  },
};

export default nextConfig;
