/* eslint-disable @next/next/no-head-element */
import { Providers } from "@/app/providers"
import { DEFAULT_LOCALE } from "@/i18n/constants"
import { getManifestUrl } from "@/shared/utils/metadata"
import { NextIntlClientProvider } from "next-intl"
import { ApplicationLayout } from "../application-layout/application-layout"
import type { ComponentProps, PropsWithChildren } from "react"

type Props = {
  messages: ComponentProps<typeof NextIntlClientProvider>['messages'];
  locale: string
}

export const Application = ({ messages, locale, children }: PropsWithChildren<Props>) => (
  <NextIntlClientProvider messages={messages} locale={DEFAULT_LOCALE}>
    <html lang={locale}>
      <head>
        <link rel="manifest" href={getManifestUrl()} />
      </head>

      <body className="antialiased">
        <Providers>
          <ApplicationLayout>
            {children}
          </ApplicationLayout>
        </Providers>
      </body>
    </html>
  </NextIntlClientProvider>
  )