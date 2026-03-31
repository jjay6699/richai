export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  robots?: string;
}

import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_NAME, SITE_URL } from "./siteConfig";

const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element?.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLink = (selector: string, rel: string, href: string) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

export const applySeo = ({ title, description, path, robots = "index,follow" }: SeoConfig) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const origin = window.location.origin.includes("localhost") ? SITE_URL : window.location.origin;
  const canonicalUrl = new URL(path, origin).toString();
  const ogImageUrl = new URL(DEFAULT_OG_IMAGE, origin).toString();

  document.title = title;

  upsertMeta('meta[name="description"]', { name: "description" }, description);
  upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
  upsertMeta('meta[name="author"]', { name: "author" }, SITE_NAME);
  upsertMeta('meta[property="og:type"]', { property: "og:type" }, "website");
  upsertMeta('meta[property="og:locale"]', { property: "og:locale" }, "en_US");
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
  upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
  upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
  upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
  upsertMeta('meta[property="og:image"]', { property: "og:image" }, ogImageUrl);
  upsertMeta('meta[property="og:image:secure_url"]', { property: "og:image:secure_url" }, ogImageUrl);
  upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, DEFAULT_OG_IMAGE_ALT);
  upsertMeta('meta[property="og:image:type"]', { property: "og:image:type" }, "image/png");
  upsertMeta('meta[property="og:image:width"]', { property: "og:image:width" }, "1692");
  upsertMeta('meta[property="og:image:height"]', { property: "og:image:height" }, "413");
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
  upsertMeta('meta[name="twitter:url"]', { name: "twitter:url" }, canonicalUrl);
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, ogImageUrl);
  upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, DEFAULT_OG_IMAGE_ALT);
  upsertLink('link[rel="canonical"]', "canonical", canonicalUrl);
};
