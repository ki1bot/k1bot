/** @type {import('next').NextConfig} */

const STORAGE_REWRITE_MAP = {
  "/default-avatar.jpg": "assets/default-avatar.jpg",
  "/gradient-blue.jpg": "assets/gradient-blue.jpg",
  "/logoKibot.png": "assets/logoKibot.png",

  "/github.png": "media/github.png",
  "/instagram.png": "media/instagram.png",
  "/linkedin.png": "media/linkedin.png",
  "/Spotify.png": "media/Spotify.png",
  "/tiktok.png": "media/tiktok.png",
  "/youtube.png": "media/youtube.png",

  "/adminUiYayasan.png": "projects/adminUiYayasan.png",
  "/coding.gif": "projects/coding.gif",
  "/MarketPlaceBroker.png": "projects/MarketPlaceBroker.png",
  "/ProjectQrcode.png": "projects/ProjectQrcode.png",

  "/screen-github.png": "screen/github.png",
  "/html.png": "screen/html.png",
  "/profile.png": "screen/profile.png",

  "/dicoding1.pdf": "sertifikat/dicoding1.pdf",
  "/dicoding1.png": "sertifikat/dicoding1.png",
  "/dicoding2.pdf": "sertifikat/dicoding2.pdf",
  "/dicoding2.png": "sertifikat/dicoding2.png",
  "/dicoding3.pdf": "sertifikat/dicoding3.pdf",
  "/dicoding3.png": "sertifikat/dicoding3.png",
  "/dicoding4.pdf": "sertifikat/dicoding4.pdf",
  "/dicoding4.png": "sertifikat/dicoding4.png",
  "/dicoding5.pdf": "sertifikat/dicoding5.pdf",
  "/dicoding5.png": "sertifikat/dicoding5.png",
  "/dicoding6.pdf": "sertifikat/dicoding6.pdf",
  "/dicoding6.png": "sertifikat/dicoding6.png",
  "/dicoding7.pdf": "sertifikat/dicoding7.pdf",
  "/dicoding7.png": "sertifikat/dicoding7.png",
  "/dicoding8.pdf": "sertifikat/dicoding8.pdf",
  "/dicoding8.png": "sertifikat/dicoding8.png",
  "/dicoding9.pdf": "sertifikat/dicoding9.pdf",
  "/dicoding9.png": "sertifikat/dicoding9.png",
  "/SertifikatKompetensi.pdf": "sertifikat/SertifikatKompetensi.pdf",
  "/SertifikatKompetensi.png": "sertifikat/SertifikatKompetensi.png",
  "/sertifikatlsp-semester1.pdf": "sertifikat/sertifikatlsp-semester1.pdf",
  "/sertifikatlsp-semester1.png": "sertifikat/sertifikatlsp-semester1.png",
  "/sertifikatlsp-semester2.pdf": "sertifikat/sertifikatlsp-semester2.pdf",
  "/sertifikatlsp-semester2.png": "sertifikat/sertifikatlsp-semester2.png",

  "/bootstrap.svg": "techstack/bootstrap.svg",
  "/cplusplus.png": "techstack/c++.png",
  "/css.svg": "techstack/css.svg",
  "/dart.png": "techstack/dart.png",
  "/delphi.png": "techstack/delphi.png",
  "/docker.png": "techstack/docker.png",
  "/expressjs.png": "techstack/expressjs.png",
  "/figma.png": "techstack/figma.png",
  "/firebase.svg": "techstack/firebase.svg",
  "/flutter.png": "techstack/flutter.png",
  "/golang.png": "techstack/golang.png",
  "/html.svg": "techstack/html.svg",
  "/java.png": "techstack/java.png",
  "/javascript.svg": "techstack/javascript.svg",
  "/laravel.png": "techstack/laravel.png",
  "/linux.png": "techstack/linux.png",
  "/mongodb.png": "techstack/mongodb.png",
  "/mysql.png": "techstack/mysql.png",
  "/nestjs.png": "techstack/nestjs.png",
  "/nextjs.png": "techstack/nextjs.png",
  "/nodejs.svg": "techstack/nodejs.svg",
  "/php.png": "techstack/php.png",
  "/postgresql.png": "techstack/postgresql.png",
  "/prismaorm.png": "techstack/prismaorm.png",
  "/python.png": "techstack/python.png",
  "/reactjs.svg": "techstack/reactjs.svg",
  "/supabase.png": "techstack/supabase.png",
  "/tailwind.svg": "techstack/tailwind.svg",
  "/typescript.png": "techstack/typescript.png",
  "/vercel.svg": "techstack/vercel.svg",
  "/vite.svg": "techstack/vite.svg",
};

const nextConfig = {
  async redirects() {
    const supabaseAssetBaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

    if (!supabaseAssetBaseUrl) {
      return [];
    }

    const cleanBaseUrl = supabaseAssetBaseUrl.replace(/\/+$/, "");

    return Object.entries(STORAGE_REWRITE_MAP).map(([source, storagePath]) => ({
      source,
      destination: `${cleanBaseUrl}/${storagePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`,
      permanent: false,
    }));
  },
};

module.exports = nextConfig;
