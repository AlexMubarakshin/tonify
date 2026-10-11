import { TestnetPage } from "@/features/testnet/testnet-page";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const PAGE_PATH = "ton-testnet-faucet";

export async function generateMetadata(): Promise<Metadata> {
  return createMetaData("testnet", DEFAULT_LOCALE, PAGE_PATH);
}

export default function TonTestnetFaucetPage() {
  return (
    <TestnetPage
      locale={DEFAULT_LOCALE}
      pageUrl={getPageUrl(DEFAULT_LOCALE, PAGE_PATH)}
      converterUrl={getPageUrl(DEFAULT_LOCALE)}
    />
  );
}
