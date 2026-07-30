const IMMUTABLE_ASSET_CACHE_CONTROL =
  "public, max-age=31536000, s-maxage=31536000, immutable";

const R2_ASSET_BASE_URL = String(
  process.env.NEXT_PUBLIC_R2_ASSET_BASE_URL || "",
)
  .trim()
  .replace(/\/+$/, "");

function createR2RemotePatterns() {
  if (!R2_ASSET_BASE_URL) {
    return [];
  }

  try {
    const url = new URL(R2_ASSET_BASE_URL);
    const basePath = url.pathname.replace(/\/+$/, "");

    return [
      {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port,
        pathname: `${basePath}/**`,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig = {
  images: {
    minimumCacheTTL: 0,
    remotePatterns: createR2RemotePatterns(),
  },

  async headers() {
    return [
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: IMMUTABLE_ASSET_CACHE_CONTROL,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
