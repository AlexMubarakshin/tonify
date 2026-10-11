import { StarsCalculator } from "@/features/stars-calculator/stars-calculator";
import { LocaleKey } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const PAGE_PATH = "telegram-stars-to-ton";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createMetaData("stars", locale as LocaleKey, PAGE_PATH);
}

export default async function TelegramStarsToTonPage({ params }: Props) {
  const { locale } = await params;

  return (
    <StarsCalculator
      locale={locale as LocaleKey}
      pageUrl={getPageUrl(locale as LocaleKey, PAGE_PATH)}
      converterUrl={getPageUrl(locale as LocaleKey)}
    />
  );
}
