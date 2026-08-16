import { AddressFormatGuide } from "@/features/address-format-guide/address-format-guide";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const GUIDE_PATH = "ton-address-format";

export async function generateMetadata(): Promise<Metadata> {
  return createMetaData("guide", DEFAULT_LOCALE, GUIDE_PATH);
}

export default function TonAddressFormatPage() {
  return (
    <AddressFormatGuide
      locale={DEFAULT_LOCALE}
      pageUrl={getPageUrl(DEFAULT_LOCALE, GUIDE_PATH)}
      converterUrl={getPageUrl(DEFAULT_LOCALE)}
    />
  );
}
