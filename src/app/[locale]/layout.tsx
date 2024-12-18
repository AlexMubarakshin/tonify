import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ApplicationLayout } from "@/features/application-layout/application-layout";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import type { LocaleKey } from "@/i18n/constants";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "../providers";
import { redirect } from "next/navigation";
import { getMessages } from "@/i18n/getMessages";
import { getManifestUrl } from "@/shared/utils/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "TONify",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
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
    <NextIntlClientProvider messages={messages} locale={locale}>
      <html lang={locale}>
        <head>
          <link rel="manifest" href={getManifestUrl()} />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <ApplicationLayout>
              {children}
            </ApplicationLayout>
          </Providers>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
