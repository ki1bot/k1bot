/** @type {import('next').NextConfig} */
const ASSET_CACHE_CONTROL =
  "public, max-age=31536000, s-maxage=31536000, immutable";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: ASSET_CACHE_CONTROL,
          },
        ],
      },
      {
        source: "/sertifikat/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: ASSET_CACHE_CONTROL,
          },
        ],
      },
    ];
  },

  async rewrites() {
    const supabaseAssetBaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

    if (!supabaseAssetBaseUrl) {
      return [];
    }

    const cleanBaseUrl = supabaseAssetBaseUrl.replace(/\/+$/, "");

    return [
      {
        source: "/assets/media/:path*",
        destination: `${cleanBaseUrl}/media/:path*`,
      },
      {
        source: "/assets/projects/:path*",
        destination: `${cleanBaseUrl}/projects/:path*`,
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
    ];
  },
};

module.exports = nextConfig;
