const DEFAULT_API_BASE_URL = "https://api.haivanevent.vn";
const ADMIN_HOSTNAME = "admin.haivanevent.vn";
const API_HOSTNAME = "api.haivanevent.vn";

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return DEFAULT_API_BASE_URL;

  try {
    const url = new URL(raw);
    if (url.hostname === ADMIN_HOSTNAME) {
      url.hostname = API_HOSTNAME;
    }
    return url.origin;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

