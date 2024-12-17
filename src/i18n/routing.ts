// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { LOCALES, DEFAULT_LOCALE } from "./constants";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  alternateLinks: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
