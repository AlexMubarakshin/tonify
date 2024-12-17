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
  };
}
