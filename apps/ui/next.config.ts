import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "localhost",
      "ut-dallas-5poh.onrender.com",
      "pub-c2617011386d436e9ce138ede230c986.r2.dev",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
}

export default nextConfig
