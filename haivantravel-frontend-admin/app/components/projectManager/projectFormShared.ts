/** Chỉ 4 loại dự án (đồng bộ Case Study / filter trên site) */
export const PROJECT_TYPE_OPTIONS = [
  { value: "Gala Dinner", label: "Gala Dinner" },
  { value: "Team Building", label: "Team Building" },
  { value: "Conference", label: "Conference" },
  { value: "Year End Party", label: "Year End Party" },
] as const;

const DEFAULT_PUBLIC_ORIGIN = "https://haivanevent.vn";
/** User site local dev (Next user app); override với NEXT_PUBLIC_SITE_URL nếu cần. */
const LOCAL_DEV_USER_ORIGIN = "http://localhost:2032";

/**
 * Origin của site khách (user frontend), không phải admin API.
 * - Ưu tiên NEXT_PUBLIC_SITE_URL (vd: https://haivanevent.vn hoặc http://localhost:2032)
 * - Dev không set env → localhost:2032
 * - Production không set env → haivanevent.vn
 */
export function getPublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      return u.origin;
    } catch {
      // fall through
    }
  }
  if (process.env.NODE_ENV === "development") {
    return LOCAL_DEV_USER_ORIGIN;
  }
  return DEFAULT_PUBLIC_ORIGIN;
}

/** Ví dụ: "dự án 1" → "du-an-1" */
export function titleToSlug(title: string): string {
  const stripped = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .toLowerCase()
    .trim();
  return stripped
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Đường dẫn chi tiết dự án trên site user: /case-study/{slug} */
export const CASE_STUDY_PUBLIC_PATH_PREFIX = "/case-study";

export function linkUrlFromTitle(title: string): string {
  const slug = titleToSlug(title);
  if (!slug) return "";
  const origin = getPublicSiteOrigin().replace(/\/+$/, "");
  return `${origin}${CASE_STUDY_PUBLIC_PATH_PREFIX}/${slug}`;
}
