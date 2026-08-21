import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  serverExternalPackages: ["aniwatch", "pino", "thread-stream"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "img.flawlessfiles.com" },
      { protocol: "https", hostname: "cdn.noitatnemucod.net" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "img1.ak.crunchyroll.com" },
      { protocol: "https", hostname: "www.animenewsnetwork.com" },
      { protocol: "https", hostname: "*.animenewsnetwork.com" }
    ],
  },
  
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "User-Agent",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/public/favicon.ico',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;