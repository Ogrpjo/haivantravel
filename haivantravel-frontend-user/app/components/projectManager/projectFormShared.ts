export const PROJECT_TYPE_OPTIONS = [
  { value: "Gala Dinner", label: "Gala Dinner" },
  { value: "Team Building", label: "Team Building" },
  { value: "Conference", label: "Conference" },
  { value: "Year End Party", label: "Year End Party" },
] as const;

const DEFAULT_PUBLIC_ORIGIN = "https://haivanevent.vn";
const LOCAL_DEV_USER_ORIGIN = "http://localhost:2032";

export function getPublicSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      return u.origin;
    } catch {
      // ignore
    }
  }
  if (process.env.NODE_ENV === "development") return LOCAL_DEV_USER_ORIGIN;
  return DEFAULT_PUBLIC_ORIGIN;
}

export function titleToSlug(title: string): string {
  const stripped = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .toLowerCase()
    .trim();
  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const CASE_STUDY_PUBLIC_PATH_PREFIX = "/case-study";

export function linkUrlFromTitle(title: string): string {
  const slug = titleToSlug(title);
  if (!slug) return "";
  return `${getPublicSiteOrigin().replace(/\/+$/, "")}${CASE_STUDY_PUBLIC_PATH_PREFIX}/${slug}`;
}
