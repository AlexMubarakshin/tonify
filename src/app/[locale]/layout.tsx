import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { PropsWithChildren } from "react";
import { setRequestLocale } from "next-intl/server";
import type { LocaleKey } from "@/i18n/constants";
import { redirect } from "next/navigation";
import { getMessages } from "@/i18n/getMessages";
import { Application } from "@/features/application/aplication";

export const metadata: Metadata = {
  applicationName: "TONify",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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
