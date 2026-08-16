import { AddressConverter } from "@/features/address-convertor/address-convertor";
import { Faq } from "@/features/faq/faq";
import { DEFAULT_LOCALE } from "@/i18n/constants";
import { createMetaData } from "@/shared/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetaData('index-page', DEFAULT_LOCALE, '');
}

export default function Home() {
  return (
    <>
      <AddressConverter locale={DEFAULT_LOCALE} />
      <Faq />
    </>
  );
}
