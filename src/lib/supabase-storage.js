const SUPABASE_ASSET_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL;

function normalizeAssetPath(path) {
  return String(path)
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function assetUrl(path) {
  if (!SUPABASE_ASSET_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ASSET_BASE_URL belum diset di .env.local",
    );
  }

  const cleanBaseUrl = SUPABASE_ASSET_BASE_URL.replace(/\/+$/, "");
  const cleanPath = normalizeAssetPath(path);

  return `${cleanBaseUrl}/${cleanPath}`;
}
