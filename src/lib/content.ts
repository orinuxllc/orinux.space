// Single content source for SSR. `content.json` is the live, admin-editable
// content; on the public (production) build it is read straight from disk.
// The preview route swaps in the draft-branch JSON at request time.
import data from "../content/content.json";

export type Bi = [string, string]; // [mn, en]
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
}

export const content = data as unknown as Content;

/** MN string for an i18n key (default rendered in the DOM; client toggles EN). */
export function mn(key: string, c: Content = content): string {
  const v = c.i18n[key];
  return v ? v[0] : key;
}
