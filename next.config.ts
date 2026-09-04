import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The asset kitchen at /render screenshots the page directly, and the dev
  // badge would be baked into every piece of campaign imagery.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // The campaign stills are rendered at 900–1600px; nothing needs more.
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920],
  },
  experimental: {
    // Pull only the icons/helpers actually referenced out of these packages.
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
