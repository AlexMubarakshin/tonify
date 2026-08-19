import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { PropsWithChildren } from "react";
import { setRequestLocale } from "next-intl/server";
import { DEFAULT_LOCALE, type LocaleKey } from "@/i18n/constants";
import { redirect } from "next/navigation";
import { getMessages } from "@/i18n/getMessages";
import { Application } from "@/features/application/aplication";

export const metadata: Metadata = {
  applicationName: "TONify",
};

/**
 * Only NON-default locales get a `/<locale>/...` route. With `localePrefix:
 * "as-needed"` the default locale is served unprefixed by the `(index)` route
 * group, so also exporting `/en/...` would publish a second, content-identical
 * copy of every English page. GitHub Pages cannot 301, and Google has already
 * been observed ignoring the `rel="canonical"` on those copies and filing them
 * as "Duplicate without user-selected canonical" — so the duplicates must not
 * be generated at all.
 */
export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: PropsWithChildren<{
  params: Promise<{ locale: LocaleKey }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as LocaleKey)) {
    console.error(`Invalid locale: ${locale}`);
    redirect(`/${routing.defaultLocale}`);
  }

  setRequestLocale(locale);

  const messages = await getMessages(locale);

  return (
    <Application messages={messages} locale={locale}>
      {children}
    </Application>
  );
}
