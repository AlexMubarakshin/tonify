import { AddressChecker } from "@/features/address-checker/address-checker";
import { LocaleKey } from "@/i18n/constants";
import { createMetaData, getPageUrl } from "@/shared/utils/metadata";
import { Metadata } from "next";

const CHECKER_PATH = "ton-wallet-address-checker";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return createMetaData("checker", locale as LocaleKey, CHECKER_PATH);
}

export default async function TonWalletAddressCheckerPage({ params }: Props) {
  const { locale } = await params;

  return (
    <AddressChecker
      locale={locale as LocaleKey}
      pageUrl={getPageUrl(locale as LocaleKey, CHECKER_PATH)}
      converterUrl={getPageUrl(locale as LocaleKey)}
    />
  );
}
