import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { setRequestLocale } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { getMessages } from "@/i18n/getMessages";
import { Application } from "@/features/application/aplication";

export const metadata: Metadata = {
  applicationName: "TONify",
};

export default async function RootLayout({
  children,
}: PropsWithChildren) {
  setRequestLocale(DEFAULT_LOCALE);

  const messages = await getMessages(DEFAULT_LOCALE);

  return (
    <Application messages={messages} locale={DEFAULT_LOCALE}>
      {children}
    </Application>
  );
}
