const SAFE_BASE_URL = "http://localhost";
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;

export function sanitizeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  if (CONTROL_CHARACTERS.test(value)) {
    return fallback;
  }

  let url: URL;
  try {
    url = new URL(value, SAFE_BASE_URL);
  } catch {
    return fallback;
  }
  if (url.origin !== SAFE_BASE_URL || url.pathname === "/login" || url.pathname.startsWith("/auth/")) {
    return fallback;
  }

  return `${url.pathname}${url.search}`;
}
