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
  meta: { title: string; description: string; descriptionEn: string; ogImage: string; favicon?: string };
  /**
   * The site's own language list, admin-managed (managed-sites schema
   * editor's "Site languages" — github-vercel-tool ContentModel.Locales).
   * Drives the Nav language-toggle buttons and is the locale set i18n.js
   * cycles through. Falls back to ["mn","en"] when absent — every field
   * migrated to the new locale-map convention (data-i18n-json) uses these
   * codes; fields still on the legacy "<key>En" convention stay MN/EN-only
   * regardless of what's listed here.
   */
  locales?: string[];
  /** Admin-editable nav links (managed-sites "Navigation" section) — order,
   *  label (localized map), and href, add/remove any of the three from the
   *  schema editor. Nav.astro falls back to a hardcoded list when absent. */
  nav?: { label: Record<string, string>; href: string }[];
  contact: { email: string; phone: string; phoneHref: string };
  footer: any;
  quote: any;
  i18n: Record<string, Bi>;
  heroStats: any[];
  resultStats: any[];
  trust: { name: string; svg?: string; logo?: string }[];
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

/**
 * Server-side initial render for a `localized` field's value (a locale map,
 * e.g. {mn: "...", en: "..."}) — renders the site's first configured
 * language (content.locales[0], default "mn"); i18n.js swaps it client-side
 * from the field's own data-i18n-json attribute once loaded.
 */
export function firstLocaleValue(v: Record<string, string> | undefined, c: Content = content): string {
  if (!v) return "";
  const first = c.locales && c.locales.length > 0 ? c.locales[0] : "mn";
  return v[first] ?? Object.values(v)[0] ?? "";
}
