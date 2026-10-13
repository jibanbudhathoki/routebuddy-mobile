export function resolveAvatarUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) {
    return trimmed;
  }

  const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!apiBaseUrl) return null;

  const origin = apiBaseUrl.replace(/\/v\d+\/?$/i, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (/^\/(?:v\d+\/)?media\//i.test(path)) {
    return `${origin}${path}`;
  }

  const encodedPath = trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${origin}/v1/media/${encodedPath}`;
}
