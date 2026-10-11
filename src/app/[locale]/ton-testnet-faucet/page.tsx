import { TestnetPage } from "@/features/testnet/testnet-page";
import { LocaleKey } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const PAGE_PATH = "ton-testnet-faucet";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createMetaData("testnet", locale as LocaleKey, PAGE_PATH);
}

export default async function TonTestnetFaucetPage({ params }: Props) {
  const { locale } = await params;

  return (
    <TestnetPage
      locale={locale as LocaleKey}
      pageUrl={getPageUrl(locale as LocaleKey, PAGE_PATH)}
      converterUrl={getPageUrl(locale as LocaleKey)}
    />
  );
}
