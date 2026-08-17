import { AddressChecker } from "@/features/address-checker/address-checker";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const CHECKER_PATH = "ton-wallet-address-checker";

export async function generateMetadata(): Promise<Metadata> {
  return createMetaData("checker", DEFAULT_LOCALE, CHECKER_PATH);
}

export default function TonWalletAddressCheckerPage() {
  return (
    <AddressChecker
      locale={DEFAULT_LOCALE}
      pageUrl={getPageUrl(DEFAULT_LOCALE, CHECKER_PATH)}
      converterUrl={getPageUrl(DEFAULT_LOCALE)}
    />
  );
}
