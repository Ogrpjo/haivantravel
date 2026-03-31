export type PageType = "home" | "blog";
export type SectionType =
  | "gallery"
  | "statistics"
  | "emotion_creator"
  | "company_overview"
  | "about_us";

export interface WebsiteContentItem {
  id: number;
  page: PageType;
  section: SectionType;
  title: string | null;
  description: string | null;
  image_url: string | null;
  extra_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface StatisticsItem {
  title: string;
  number: string;
}
