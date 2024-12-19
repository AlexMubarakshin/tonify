import { AddressConverter } from "@/features/address-convertor/address-convertor";
import { LocaleKey } from "@/i18n/constants";
import { createMetaData } from "@/shared/utils/metadata";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string, locale: string; }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { locale } = await params;

  return createMetaData('index-page', locale as LocaleKey, locale);
}

export default function Home() {
  return (
    <AddressConverter />
  );
}
