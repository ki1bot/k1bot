/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const supabaseAssetBaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

    if (!supabaseAssetBaseUrl) {
      return [];
    }

    const cleanBaseUrl = supabaseAssetBaseUrl.replace(/\/+$/, "");

    return [
      {
        source: "/assets/:path*",
        destination: `${cleanBaseUrl}/assets/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${cleanBaseUrl}/media/:path*`,
      },
      {
        source: "/projects/:path*",
        destination: `${cleanBaseUrl}/projects/:path*`,
      },
      {
        source: "/screen/:path*",
        destination: `${cleanBaseUrl}/screen/:path*`,
      },
      {
        source: "/sertifikat/:path*",
        destination: `${cleanBaseUrl}/sertifikat/:path*`,
      },
      {
        source: "/techstack/:path*",
        destination: `${cleanBaseUrl}/techstack/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
