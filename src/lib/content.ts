// Content sources for SSR. `content.json` is the main admin-editable site copy;
// `news.json` is the editorial news feed, kept in a SEPARATE file so frequent
// news edits don't churn the big content dictionary. Both are read straight from
// disk for the production build; the preview route swaps in the draft-branch JSON.
import data from "../content/content.json";
import newsData from "../content/news.json";

export type Bi = [string, string]; // [mn, en]
export interface TeamMember {
  name: string; nameEn?: string;
  role?: string; roleEn?: string;
  photo?: string;
  bio?: string; bioEn?: string;
}
export interface Content {
  meta: { title: string; description: string; descriptionEn: string; ogImage: string };
  contact: { email: string; phone: string; phoneHref: string };
  footer: any;
  quote: any;
  i18n: Record<string, Bi>;
  heroStats: any[];
  resultStats: any[];
  trust: { name: string; svg: string }[];
  modules: { code: string; cat: string; name: string; nameEn: string; desc: string; descEn: string }[];
  features: any[];
  services: any[];
  industries: any[];
  pricing: any[];
  faq: any[];
  teams?: TeamMember[];
}

export type NewsBlock = { mn: string; en?: string } | { img: string; cap?: string; capEn?: string };
export interface NewsItem {
  slug: string;
  feature?: boolean;
  tag: string; tagEn?: string;
  date: string;
  read?: string;
  cover?: string;
  author?: string; authorEn?: string;
  role?: string; roleEn?: string;
  title: string; titleEn?: string;
  excerpt?: string; excerptEn?: string;
  body: NewsBlock[];
}
export interface News { items: NewsItem[] }

export const content = data as unknown as Content;
export const news = newsData as unknown as News;

/** Published news items. Pass a draft `News` to render unpublished items (preview). */
export function newsItems(n: News = news): NewsItem[] {
  return n?.items ?? [];
}
export function findNews(slug: string, n: News = news): NewsItem | undefined {
  return newsItems(n).find((it) => it.slug === slug);
}
export const isImgBlock = (b: NewsBlock): b is { img: string; cap?: string; capEn?: string } =>
  !!b && typeof (b as any).img === "string";

/** MN string for an i18n key (default rendered in the DOM; client toggles EN). */
export function mn(key: string, c: Content = content): string {
  const v = c.i18n[key];
  return v ? v[0] : key;
}
