const SUPABASE_ASSET_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

function assertAssetBaseUrl() {
  if (!SUPABASE_ASSET_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL belum diset. Tambahkan environment variable ini di .env.local dan Vercel.",
    );
  }

  return SUPABASE_ASSET_BASE_URL.replace(/\/+$/, "");
}

function encodeStoragePath(path) {
  return String(path)
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normalizeLegacyAssetPath(path) {
  const cleanPath = String(path).trim().replace(/^\/+/, "");

  if (!cleanPath) {
    return "";
  }

  const legacyPathMap = [
    {
      from: "assets/media/",
      to: "media/",
    },
    {
      from: "assets/projects/",
      to: "projects/",
    },
    {
      from: "assets/screen/",
      to: "screen/",
    },
    {
      from: "assets/techstack/",
      to: "techstack/",
    },
    {
      from: "assets/sertifikat/",
      to: "sertifikat/",
    },
    {
      from: "sertifikat/",
      to: "sertifikat/",
    },
  ];

  const matchedRule = legacyPathMap.find((rule) =>
    cleanPath.startsWith(rule.from),
  );

  if (!matchedRule) {
    return cleanPath;
  }

  return cleanPath.replace(matchedRule.from, matchedRule.to);
}

export function assetUrl(path) {
  const baseUrl = assertAssetBaseUrl();
  const cleanPath = normalizeLegacyAssetPath(path);

  if (!cleanPath) {
    return "";
  }

  return `${baseUrl}/${encodeStoragePath(cleanPath)}`;
}

export function resolveAssetUrl(value) {
  if (!value) {
    return "";
  }

  const cleanValue = String(value).trim();

  if (!cleanValue) {
    return "";
  }

  if (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:")
  ) {
    return cleanValue;
  }

  return assetUrl(cleanValue);
}

export function createPdfUrlFromImageUrl(value) {
  const resolvedImageUrl = resolveAssetUrl(value);

  if (!resolvedImageUrl) {
    return "";
  }

  return resolvedImageUrl.replace(/\.(png|jpg|jpeg|webp)$/i, ".pdf");
}
