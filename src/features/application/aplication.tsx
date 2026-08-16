/* eslint-disable @next/next/no-head-element */
import { Providers } from "@/app/providers"
import { DEFAULT_LOCALE, LOCALE_HREFLANG, LocaleKey } from "@/i18n/constants"
import { getManifestUrl } from "@/shared/utils/metadata"
import { NextIntlClientProvider } from "next-intl"
import { ApplicationLayout } from "../application-layout/application-layout"
import { StructuredData } from "../structured-data/structured-data"
import type { ComponentProps, PropsWithChildren } from "react"

type Props = {
  messages: ComponentProps<typeof NextIntlClientProvider>['messages'];
  locale: LocaleKey;
}

export const Application = ({ messages, locale, children }: PropsWithChildren<Props>) => {
  const description =
    (messages as Record<string, { description?: string }> | undefined)?.["index-page"]
      ?.description ?? "";

  return (
  <NextIntlClientProvider messages={messages} locale={DEFAULT_LOCALE}>
    {/* BCP-47 tag, not the route segment: `zh-cn` would disagree with the
        `zh-Hans` hreflang, and Bing leans on <html lang> more than hreflang. */}
    <html lang={LOCALE_HREFLANG[locale]} suppressHydrationWarning>
      <head>
        <link rel="manifest" href={getManifestUrl()} />
        <StructuredData locale={locale} description={description} />
      </head>

      <body className="antialiased bg-background text-foreground">
        <Providers>
          <ApplicationLayout locale={locale}>
            {children}
          </ApplicationLayout>
        </Providers>
      </body>
    </html>
  </NextIntlClientProvider>
  );
}