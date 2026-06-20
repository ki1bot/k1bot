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
