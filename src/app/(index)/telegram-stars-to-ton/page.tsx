import { StarsCalculator } from "@/features/stars-calculator/stars-calculator";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const PAGE_PATH = "telegram-stars-to-ton";

export async function generateMetadata(): Promise<Metadata> {
  return createMetaData("stars", DEFAULT_LOCALE, PAGE_PATH);
}

export default function TelegramStarsToTonPage() {
  return (
    <StarsCalculator
      locale={DEFAULT_LOCALE}
      pageUrl={getPageUrl(DEFAULT_LOCALE, PAGE_PATH)}
      converterUrl={getPageUrl(DEFAULT_LOCALE)}
    />
  );
}
