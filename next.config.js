/** @type {import("next").NextConfig} */
const IMMUTABLE_ASSET_CACHE_CONTROL =
  "public, max-age=31536000, s-maxage=31536000, immutable";

const MUTABLE_PROJECT_CACHE_CONTROL =
  "no-store, no-cache, max-age=0, must-revalidate";

const nextConfig = {
  images: {
    minimumCacheTTL: 0,
  },

  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: IMMUTABLE_ASSET_CACHE_CONTROL,
          },
        ],
      },
      {
        source: "/assets/projects/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: MUTABLE_PROJECT_CACHE_CONTROL,
          },
        ],
      },
      {
        source: "/sertifikat/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: IMMUTABLE_ASSET_CACHE_CONTROL,
          },
        ],
      },
    ];
  },

  async rewrites() {
    const supabaseAssetBaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

    if (!supabaseAssetBaseUrl) {
      return {
        beforeFiles: [],
        afterFiles: [],
        fallback: [],
      };
    }

    const cleanBaseUrl = supabaseAssetBaseUrl.replace(/\/+$/, "");

    return {
      beforeFiles: [
        {
          source: "/assets/projects/:path*",
          destination: `${cleanBaseUrl}/projects/:path*`,
        },
      ],

      afterFiles: [
        {
          source: "/assets/media/:path*",
          destination: `${cleanBaseUrl}/media/:path*`,
        },
        {
          source: "/assets/screen/:path*",
          destination: `${cleanBaseUrl}/screen/:path*`,
        },
        {
          source: "/assets/techstack/:path*",
          destination: `${cleanBaseUrl}/techstack/:path*`,
        },
        {
          source: "/assets/sertifikat/:path*",
          destination: `${cleanBaseUrl}/sertifikat/:path*`,
        },
        {
          source: "/sertifikat/:path*",
          destination: `${cleanBaseUrl}/sertifikat/:path*`,
        },
        {
          source: "/assets/:path*",
          destination: `${cleanBaseUrl}/assets/:path*`,
        },
      ],

      fallback: [],
    };
  },
};

module.exports = nextConfig;
