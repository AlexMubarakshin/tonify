import { DEFAULT_LOCALE, LocaleKey, LOCALES } from "@/i18n/constants";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

function normilizeURL(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function joinURL(...parts: string[]) {
  return normilizeURL(parts.map(normilizeURL).join("/"));
}

export async function createMetaData(
  translationNamespace: string,
  locale: LocaleKey,
  path: string
): Promise<Metadata> {
  const FAV_ICONS = ["16x16", "32x32", "96x96", "128x128", "196x196", "512x512"];
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
  const url = normilizeURL(path);

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      url,
      type: "website",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: url,
      languages: {
        "x-default": joinURL(
          process.env.APP_FULL_PATH || "",
          DEFAULT_LOCALE,
          path
        ),
        ...Object.fromEntries(
          LOCALES.map((locale) => [
            locale,
            joinURL(process.env.APP_FULL_PATH || "", locale, path),
          ])
        ),
      },
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
