const githubPages = process.env.GITHUB_PAGES === "true";
const repoBase = process.env.GITHUB_PAGES_BASE || "/Ecommers";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(githubPages
    ? {
        output: "export",
        basePath: repoBase,
        assetPrefix: `${repoBase}/`,
        trailingSlash: true,
      }
    : {}),
  // Avoid stale webpack pack files on Windows breaking dev CSS (layout.css 404).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    }
    return config;
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/Route-Academy-products/**",
      },
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/Route-Academy-categories/**",
      },
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/Route-Academy-brands/**",
      },
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;