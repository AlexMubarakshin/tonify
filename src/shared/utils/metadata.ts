import {
  DEFAULT_LOCALE,
  LocaleKey,
  LOCALES,
  LOCALE_HREFLANG,
  LOCALE_OG,
} from "@/i18n/constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAppBasePath, joinURL, normilizeURL } from "./path";

export function getManifestUrl() {
  const basePath = getAppBasePath();
  if (!basePath) {
    return "/manifest.json";
  }

  return joinURL(basePath, "manifest.json");
}

/**
 * Absolute, canonical URL for a given locale + path, matching how GitHub Pages
 * serves the static export:
 *  - default locale at the site root, WITH a trailing slash (`/tonify/`) because
 *    it is a directory index and `/tonify` 301-redirects to `/tonify/`.
 *  - other locales as extension-less files WITHOUT a trailing slash (`/tonify/ru`).
 */
export function getPageUrl(locale: LocaleKey, path = ""): string {
  const site = normilizeURL(process.env.APP_FULL_PATH || "");
  const segment = locale === DEFAULT_LOCALE ? "" : locale;
  const parts = [site, segment, path].filter(Boolean);
  const joined = joinURL(...parts);

  // Root of the default locale must keep the trailing slash.
  return parts.length <= 1 ? `${joined}/` : joined;
}

export function getLanguageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": getPageUrl(DEFAULT_LOCALE, path),
  };

  for (const locale of LOCALES) {
    languages[LOCALE_HREFLANG[locale]] = getPageUrl(locale, path);
  }

  return languages;
}

export async function createMetaData(
  translationNamespace: string,
  locale: LocaleKey,
  path: string
): Promise<Metadata> {
  const FAV_ICONS = [
    "16x16",
    "32x32",
    "96x96",
    "128x128",
    "196x196",
    "512x512",
  ];
  const APPLE_ICONS = [
    "57x57",
    "60x60",
    "72x72",
    "76x76",
    "114x114",
    "120x120",
    "144x144",
    "152x152",
    "167x167",
    "180x180",
    "512x512",
  ];

  const t = await getTranslations({ locale, namespace: translationNamespace });
  const url = getPageUrl(locale, path);
  const site = normilizeURL(process.env.APP_FULL_PATH || "");
  const ogImage = site ? joinURL(site, "og-image.png") : "/og-image.png";

  return {
    metadataBase: site ? new URL(`${site}/`) : undefined,
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      url,
      type: "website",
      siteName: "TONify",
      locale: LOCALE_OG[locale],
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: getLanguageAlternates(path),
    },
    keywords: t("meta.keywords"),
    icons: {
      icon: FAV_ICONS.map((size) => ({
        url: `favicon-${size}.png`,
        size,
      })),
      apple: APPLE_ICONS.map((size) => ({
        url: `apple-touch-icon-${size}.png`,
        size,
      })),
    },
  };
}
