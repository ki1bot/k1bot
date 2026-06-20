const ASSET_ALIAS_MAP = {
  "assets/default-avatar.jpg": "/assets/default-avatar.jpg",
  "assets/gradient-blue.jpg": "/assets/gradient-blue.jpg",
  "assets/logoKibot.png": "/assets/logoKibot.png",
  "assets/rifqi.jpg": "/assets/rifqi.jpg",

  "media/github.png": "/assets/media/github.png",
  "media/instagram.png": "/assets/media/instagram.png",
  "media/linkedin.png": "/assets/media/linkedin.png",
  "media/Spotify.png": "/assets/media/Spotify.png",
  "media/tiktok.png": "/assets/media/tiktok.png",
  "media/youtube.png": "/assets/media/youtube.png",

  "projects/adminUiYayasan.png": "/assets/projects/adminUiYayasan.png",
  "projects/coding.gif": "/assets/projects/coding.gif",
  "projects/MarketPlaceBroker.png": "/assets/projects/MarketPlaceBroker.png",
  "projects/PelayananJasaAc.png": "/assets/projects/PelayananJasaAc.png",
  "projects/ProjectQrcode.png": "/assets/projects/ProjectQrcode.png",
  "projects/TugasAlgo2APelayananJasaAc.pdf":
    "/assets/projects/TugasAlgo2APelayananJasaAc.pdf",

  "screen/github.png": "/assets/screen/github.png",
  "screen/html.png": "/assets/screen/html.png",
  "screen/profile.png": "/assets/screen/profile.png",

  "sertifikat/dicoding1.pdf": "/sertifikat/dicoding1.pdf",
  "sertifikat/dicoding1.png": "/sertifikat/dicoding1.png",
  "sertifikat/dicoding2.pdf": "/sertifikat/dicoding2.pdf",
  "sertifikat/dicoding2.png": "/sertifikat/dicoding2.png",
  "sertifikat/dicoding3.pdf": "/sertifikat/dicoding3.pdf",
  "sertifikat/dicoding3.png": "/sertifikat/dicoding3.png",
  "sertifikat/dicoding4.pdf": "/sertifikat/dicoding4.pdf",
  "sertifikat/dicoding4.png": "/sertifikat/dicoding4.png",
  "sertifikat/dicoding5.pdf": "/sertifikat/dicoding5.pdf",
  "sertifikat/dicoding5.png": "/sertifikat/dicoding5.png",
  "sertifikat/dicoding6.pdf": "/sertifikat/dicoding6.pdf",
  "sertifikat/dicoding6.png": "/sertifikat/dicoding6.png",
  "sertifikat/dicoding7.pdf": "/sertifikat/dicoding7.pdf",
  "sertifikat/dicoding7.png": "/sertifikat/dicoding7.png",
  "sertifikat/dicoding8.pdf": "/sertifikat/dicoding8.pdf",
  "sertifikat/dicoding8.png": "/sertifikat/dicoding8.png",
  "sertifikat/dicoding9.pdf": "/sertifikat/dicoding9.pdf",
  "sertifikat/dicoding9.png": "/sertifikat/dicoding9.png",
  "sertifikat/SertifikatKompetensi.pdf": "/sertifikat/SertifikatKompetensi.pdf",
  "sertifikat/SertifikatKompetensi.png": "/sertifikat/SertifikatKompetensi.png",
  "sertifikat/sertifikatlsp-semester1.pdf":
    "/sertifikat/sertifikatlsp-semester1.pdf",
  "sertifikat/sertifikatlsp-semester1.png":
    "/sertifikat/sertifikatlsp-semester1.png",
  "sertifikat/sertifikatlsp-semester2.pdf":
    "/sertifikat/sertifikatlsp-semester2.pdf",
  "sertifikat/sertifikatlsp-semester2.png":
    "/sertifikat/sertifikatlsp-semester2.png",

  "techstack/bootstrap.svg": "/assets/techstack/bootstrap.svg",
  "techstack/c++.png": "/assets/techstack/c++.png",
  "techstack/css.svg": "/assets/techstack/css.svg",
  "techstack/dart.png": "/assets/techstack/dart.png",
  "techstack/delphi.png": "/assets/techstack/delphi.png",
  "techstack/docker.png": "/assets/techstack/docker.png",
  "techstack/expressjs.png": "/assets/techstack/expressjs.png",
  "techstack/figma.png": "/assets/techstack/figma.png",
  "techstack/firebase.svg": "/assets/techstack/firebase.svg",
  "techstack/flutter.png": "/assets/techstack/flutter.png",
  "techstack/golang.png": "/assets/techstack/golang.png",
  "techstack/html.svg": "/assets/techstack/html.svg",
  "techstack/java.png": "/assets/techstack/java.png",
  "techstack/javascript.svg": "/assets/techstack/javascript.svg",
  "techstack/laravel.png": "/assets/techstack/laravel.png",
  "techstack/linux.png": "/assets/techstack/linux.png",
  "techstack/mongodb.png": "/assets/techstack/mongodb.png",
  "techstack/mysql.png": "/assets/techstack/mysql.png",
  "techstack/nestjs.png": "/assets/techstack/nestjs.png",
  "techstack/nextjs.png": "/assets/techstack/nextjs.png",
  "techstack/nodejs.svg": "/assets/techstack/nodejs.svg",
  "techstack/php.png": "/assets/techstack/php.png",
  "techstack/postgresql.png": "/assets/techstack/postgresql.png",
  "techstack/prismaorm.png": "/assets/techstack/prismaorm.png",
  "techstack/python.png": "/assets/techstack/python.png",
  "techstack/reactjs.svg": "/assets/techstack/reactjs.svg",
  "techstack/supabase.png": "/assets/techstack/supabase.png",
  "techstack/tailwind.svg": "/assets/techstack/tailwind.svg",
  "techstack/typescript.png": "/assets/techstack/typescript.png",
  "techstack/vercel.svg": "/assets/techstack/vercel.svg",
  "techstack/vite.svg": "/assets/techstack/vite.svg",
};

function cleanAssetPath(value) {
  return String(value || "").trim();
}

function stripLeadingSlash(value) {
  return cleanAssetPath(value).replace(/^\/+/, "");
}

function getStoragePathFromSupabaseUrl(value) {
  try {
    const url = new URL(value);
    const marker = "/storage/v1/object/public/portofolio-assets/";
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return "";

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return "";
  }
}

function normalizeAssetKey(value) {
  const cleanPath = stripLeadingSlash(value);

  if (!cleanPath) return "";

  if (cleanPath.startsWith("assets/sertifikat/")) {
    return cleanPath.replace("assets/sertifikat/", "sertifikat/");
  }

  if (cleanPath.startsWith("assets/media/")) {
    return cleanPath.replace("assets/media/", "media/");
  }

  if (cleanPath.startsWith("assets/projects/")) {
    return cleanPath.replace("assets/projects/", "projects/");
  }

  if (cleanPath.startsWith("assets/screen/")) {
    return cleanPath.replace("assets/screen/", "screen/");
  }

  if (cleanPath.startsWith("assets/techstack/")) {
    return cleanPath.replace("assets/techstack/", "techstack/");
  }

  return cleanPath;
}

export function assetUrl(path) {
  const cleanPath = cleanAssetPath(path);

  if (!cleanPath) return "";

  if (cleanPath.startsWith("data:") || cleanPath.startsWith("blob:")) {
    return cleanPath;
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    const storagePath = getStoragePathFromSupabaseUrl(cleanPath);

    if (storagePath) {
      return assetUrl(storagePath);
    }

    return cleanPath;
  }

  const normalizedPath = normalizeAssetKey(cleanPath);

  if (!normalizedPath) return "";

  if (ASSET_ALIAS_MAP[normalizedPath]) {
    return ASSET_ALIAS_MAP[normalizedPath];
  }

  if (normalizedPath.startsWith("assets/")) {
    return `/${normalizedPath}`;
  }

  if (
    normalizedPath.startsWith("media/") ||
    normalizedPath.startsWith("projects/") ||
    normalizedPath.startsWith("screen/") ||
    normalizedPath.startsWith("techstack/")
  ) {
    return `/assets/${normalizedPath}`;
  }

  if (normalizedPath.startsWith("sertifikat/")) {
    return `/${normalizedPath}`;
  }

  return `/${normalizedPath}`;
}

export function resolveAssetUrl(value) {
  return assetUrl(value);
}

export function createPdfUrlFromImageUrl(value) {
  const resolvedImageUrl = resolveAssetUrl(value);

  if (!resolvedImageUrl) return "";

  return resolvedImageUrl.replace(/\.(png|jpg|jpeg|webp)$/i, ".pdf");
}
