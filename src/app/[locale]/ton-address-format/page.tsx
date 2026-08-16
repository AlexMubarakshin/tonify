import { AddressFormatGuide } from "@/features/address-format-guide/address-format-guide";
import { LocaleKey } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const GUIDE_PATH = "ton-address-format";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createMetaData("guide", locale as LocaleKey, GUIDE_PATH);
}

export default async function TonAddressFormatPage({ params }: Props) {
  const { locale } = await params;

  return (
    <AddressFormatGuide
      locale={locale as LocaleKey}
      pageUrl={getPageUrl(locale as LocaleKey, GUIDE_PATH)}
      converterUrl={getPageUrl(locale as LocaleKey)}
    />
  );
}
