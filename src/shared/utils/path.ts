import { DEFAULT_LOCALE, LOCALES, type LocaleKey } from "@/i18n/constants";

/**
 * App-relative href for `path` in `locale`, following the `as-needed` prefix
 * strategy (default locale unprefixed). Returned WITHOUT the basePath —
 * `next/link` prepends it.
 */
export function getLocaleHref(locale: LocaleKey, path = "/") {
  const suffix = path === "/" ? "" : path;

  return locale === DEFAULT_LOCALE ? suffix || "/" : `/${locale}${suffix}`;
}

/**
 * Removes a leading locale segment from an app-relative pathname, so the
 * current page can be re-rendered in another language:
 * `/ru/ton-address-format` -> `/ton-address-format`.
 */
export function stripLocaleFromPath(pathname: string) {
  const [, first, ...rest] = pathname.split("/");

  if (!LOCALES.includes(first as LocaleKey)) {
    return pathname || "/";
  }

  return `/${rest.join("/")}`.replace(/\/$/, "") || "/";
}

export function getAppBasePath() {
  return process.env.APP_BASE_PATH &&
    typeof process.env.APP_BASE_PATH === "string"
    ? process.env.APP_BASE_PATH
    : undefined;
}

export function getAssetPath(src: string) {
  const basePath = getAppBasePath();
  const normalizedSrc = src.replace(/^\//, "");

  return basePath ? `${basePath}/${normalizedSrc}` : src;
}

export function normilizeURL(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function joinURL(...parts: string[]) {
  return normilizeURL(parts.map(normilizeURL).join("/"));
}
