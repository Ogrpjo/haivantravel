import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "../../components/layout/Footer";
import Navigationbar from "../../components/Navigationbar";

type ApiProject = {
  id: number;
  title: string;
  short_description: string | null;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_description: string | null;
  project_type: string | null;
  duration_days: number | null;
  guest_count: number | null;
  artist_count: number | null;
  image_url: string;
  link_url: string;
  content: string | null;
  html_content: string | null;
  css_content: string | null;
};

type GrapesStyleRule = {
  selectors?: Array<{ name?: string; type?: string } | string> | string;
  selectorsAdd?: string;
  style?: Record<string, string | number>;
  atRuleType?: string;
  atRuleParams?: string;
  state?: string;
  mediaText?: string;
};

type ParsedGrapesProject = {
  pages?: Array<{
    component?: unknown;
    frames?: Array<{ component?: unknown; styles?: unknown; css?: string }>;
    styles?: unknown;
    css?: string;
  }>;
  styles?: unknown;
  css?: string;
};

type GrapesComponentNode = {
  type?: string;
  tagName?: string;
  void?: boolean;
  content?: string;
  attributes?: Record<string, string | number | boolean>;
  classes?: Array<string | { name?: string }>;
  components?: GrapesComponentNode[] | GrapesComponentNode | string;
};

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.haivanevent.vn";
}

function titleToSlug(title: string): string {
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

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function remapUiBlockSelector(selector: string): string {
  const trimmed = selector.trim();
  if (!trimmed) return "";
  if (trimmed === "body" || trimmed === "html") return ".ui-block-body";
  return trimmed
    .replace(/^body\b/, ".ui-block-body")
    .replace(/^html\b/, ".ui-block-body");
}

function normalizeSelector(selector: { name?: string; type?: string } | string): string {
  if (typeof selector === "string") {
    const trimmed = selector.trim();
    if (!trimmed) return "";
    if (/^[.#\[:*]/.test(trimmed)) return remapUiBlockSelector(trimmed);
    if (/[>+~,\s]/.test(trimmed)) return remapUiBlockSelector(trimmed);
    if (/^[a-z][a-z0-9-]*$/i.test(trimmed)) return remapUiBlockSelector(trimmed);
    return remapUiBlockSelector(`.${trimmed}`);
  }

  const name = selector?.name?.trim();
  if (!name) return "";
  if (selector?.type === "id") return remapUiBlockSelector(`#${name}`);
  if (selector?.type === "class") return remapUiBlockSelector(`.${name}`);
  if (/^[.#\[:]/.test(name) || name.includes(" ")) return remapUiBlockSelector(name);
  return remapUiBlockSelector(`.${name}`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getNodeTagName(node: GrapesComponentNode): string {
  if (node.tagName?.trim()) return node.tagName.trim().toLowerCase();
  if (node.type === "image") return "img";
  if (node.type === "link") return "a";
  if (node.type === "svg") return "svg";
  if (node.type === "svg-in") return "path";
  if (node.type === "wrapper") return "div";
  return "div";
}

function joinNodeClasses(classes: GrapesComponentNode["classes"]): string {
  if (!Array.isArray(classes)) return "";
  return classes
    .map((entry) => (typeof entry === "string" ? entry.trim() : entry?.name?.trim() || ""))
    .filter(Boolean)
    .join(" ");
}

function renderGrapesComponentsToHtml(
  input: GrapesComponentNode[] | GrapesComponentNode | string | undefined,
): string {
  if (input == null) return "";
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    return input.map((node) => renderGrapesComponentsToHtml(node)).join("");
  }

  const node = input;
  if (node.type === "textnode") {
    return escapeHtml(String(node.content ?? ""));
  }

  const rawTagName = getNodeTagName(node);
  const tagName = rawTagName === "body" || rawTagName === "html" ? "div" : rawTagName;
  const classFromNode = joinNodeClasses(node.classes);
  const mergedClass = `${String((node.attributes ?? {}).class ?? "").trim()} ${classFromNode}`.trim();
  const nextAttributes: Record<string, unknown> =
    rawTagName === "body" || rawTagName === "html"
      ? {
          ...(node.attributes ?? {}),
          class: `${mergedClass} ui-block-body`.trim(),
        }
      : {
          ...(node.attributes ?? {}),
          ...(mergedClass ? { class: mergedClass } : {}),
        };

  const attrs = Object.entries(nextAttributes)
    .filter(([, value]) => value !== false && value !== null && value !== undefined)
    .map(([key, value]) => {
      if (value === true) return key;
      return `${key}="${escapeHtml(String(value))}"`;
    })
    .join(" ");
  const openTag = attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;

  if (node.void) {
    return attrs ? `<${tagName} ${attrs} />` : `<${tagName} />`;
  }

  const childrenHtml = renderGrapesComponentsToHtml(node.components);
  return `${openTag}${childrenHtml}</${tagName}>`;
}

function extractCssFromGrapesStyles(styles: unknown): string {
  if (!Array.isArray(styles)) return "";
  const rules = styles as GrapesStyleRule[];

  return rules
    .map((rule) => {
      const styleObj = rule.style ?? {};
      const declarations = Object.entries(styleObj)
        .map(([key, val]) => `${toKebabCase(key)}:${String(val)};`)
        .join("");
      if (!declarations) return "";

      const rawSelectors = Array.isArray(rule.selectors)
        ? rule.selectors
        : typeof rule.selectors === "string"
          ? rule.selectors.split(",")
          : rule.selectorsAdd
            ? [rule.selectorsAdd]
            : [];

      const selectors = rawSelectors
        .map((selector) => normalizeSelector(selector))
        .filter(Boolean)
        .join(", ");
      const stateSuffix = rule.state?.trim() ? `:${rule.state.trim()}` : "";
      const selectorWithState = selectors
        ? selectors
            .split(",")
            .map((s) => `${s.trim()}${stateSuffix}`)
            .join(", ")
        : "";
      const block = selectorWithState
        ? `${selectorWithState}{${declarations}}`
        : declarations;

      const atRuleType = rule.atRuleType?.trim();
      const atRuleParams = rule.atRuleParams?.trim() || rule.mediaText?.trim() || "";
      if (atRuleType) {
        if (!atRuleParams) {
          return `@${atRuleType}{${block}}`;
        }
        return `@${atRuleType} ${atRuleParams}{${block}}`;
      }
      return selectorWithState ? block : "";
    })
    .filter(Boolean)
    .join("\n");
}

function resolveProjectContent(
  rawContent: string | null,
  htmlContent?: string | null,
  cssContent?: string | null,
): string {
  const wrapWithScope = (html: string) => `<div class="ui-block-body">${html}</div>`;
  const scopeCss = (css: string) =>
    css
      .replace(/(^|[\s,{])body(?=[\s.#:[,{>]|$)/g, "$1.ui-block-body")
      .replace(/(^|[\s,{])html(?=[\s.#:[,{>]|$)/g, "$1.ui-block-body");

  const directHtml = htmlContent?.trim();
  if (directHtml) {
    const directCss = cssContent?.trim();
    const normalizedCss = directCss ? scopeCss(directCss) : "";
    const wrappedHtml = wrapWithScope(directHtml);
    return normalizedCss ? `<style>${normalizedCss}</style>${wrappedHtml}` : wrappedHtml;
  }

  const trimmed = rawContent?.trim();
  if (!trimmed) return "<p>Chưa có nội dung chi tiết cho dự án này.</p>";

  if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return wrapWithScope(trimmed);

  try {
    const parsed = JSON.parse(trimmed) as ParsedGrapesProject;

    const firstPage = parsed.pages?.[0];
    const pageComponent = firstPage?.component;
    const frameComponent = firstPage?.frames?.[0]?.component;

    const html =
      typeof pageComponent === "string"
        ? pageComponent
        : typeof frameComponent === "string"
          ? frameComponent
          : renderGrapesComponentsToHtml(
              (pageComponent ?? frameComponent) as GrapesComponentNode | GrapesComponentNode[] | undefined,
            );
    if (!html) return trimmed;

    const cssSources = [
      typeof parsed.css === "string" ? parsed.css.trim() : "",
      typeof firstPage?.css === "string" ? firstPage.css.trim() : "",
      typeof firstPage?.frames?.[0]?.css === "string" ? firstPage.frames[0].css.trim() : "",
    ].filter(Boolean);
    const cssRules = [
      extractCssFromGrapesStyles(parsed.styles),
      extractCssFromGrapesStyles(firstPage?.styles),
      extractCssFromGrapesStyles(firstPage?.frames?.[0]?.styles),
    ].filter(Boolean);
    const normalizedRawCss = cssSources
      .join("\n")
      .replace(/(^|[\s,{])body(?=[\s.#:[,{>]|$)/g, "$1.ui-block-body")
      .replace(/(^|[\s,{])html(?=[\s.#:[,{>]|$)/g, "$1.ui-block-body");
    const css = [normalizedRawCss, ...cssRules].filter(Boolean).join("\n");
    return css ? `<style>${css}</style>${html}` : html;
  } catch {
    return wrapWithScope(trimmed);
  }
}

async function getProjectBySlug(slug: string): Promise<ApiProject | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as ApiProject[];
    if (!Array.isArray(data)) return null;
    const decoded = decodeURIComponent(slug);
    return (
      data.find((p) => titleToSlug(p.title?.trim() || "") === decoded) ?? null
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Dự án | Hải Vân Travel" };
  }
  const title =
    project.seo_title?.trim() ||
    `${project.title?.trim() || "Dự án"} | Hải Vân Travel`;
  const description =
    project.seo_description?.trim() ||
    project.short_description?.trim() ||
    undefined;
  const keywords = project.seo_keywords?.trim()
    ? project.seo_keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    : undefined;
  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const resolvedContent = resolveProjectContent(
    project.content,
    project.html_content,
    project.css_content,
  );

  return (
    <main className="w-screen min-h-screen bg-[#111111] flex flex-col relative">
      <Navigationbar />
      <section className="w-full flex-1 text-white">
        <div className="w-full max-w-[1200px] mx-auto px-6 max-sm:px-4 py-10">
          <article
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-a:text-[#05B9BA] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:ml-4 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: resolvedContent }}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
