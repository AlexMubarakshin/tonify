"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { LocaleKey } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";

/** The account used across every example — the same one the converter loads. */
const EXAMPLE = {
  raw: "0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
  bounceable: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
  nonBounceable: "UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI",
  testnetBounceable: "kQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqKYH",
  testnetNonBounceable: "0QCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqPvC",
} as const;

const EXAMPLE_KEYS = [
  "raw",
  "bounceable",
  "nonBounceable",
  "testnetBounceable",
  "testnetNonBounceable",
] as const;

const ANATOMY_ROWS = [
  { key: "flags", size: "1" },
  { key: "workchain", size: "1" },
  { key: "account", size: "32" },
  { key: "checksum", size: "2" },
] as const;

const PREFIX_ROWS = [
  { prefix: "EQ", testnet: false, bounceable: true, chain: "basechain", use: "eq" },
  { prefix: "UQ", testnet: false, bounceable: false, chain: "basechain", use: "uq" },
  { prefix: "kQ", testnet: true, bounceable: true, chain: "basechain", use: "kq" },
  { prefix: "0Q", testnet: true, bounceable: false, chain: "basechain", use: "zq" },
  { prefix: "Ef", testnet: false, bounceable: true, chain: "masterchain", use: "ef" },
  { prefix: "Uf", testnet: false, bounceable: false, chain: "masterchain", use: "uf" },
] as const;

type Props = {
  locale: LocaleKey;
  /** Absolute URL of this page, used by the JSON-LD. */
  pageUrl: string;
  /** Absolute URL of the converter, used by the breadcrumb JSON-LD. */
  converterUrl: string;
};

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-large border border-divider">
    <table className="w-full text-left text-sm border-collapse">{children}</table>
  </div>
);

export const AddressFormatGuide = ({ locale, pageUrl, converterUrl }: Props) => {
  const t = useTranslations("guide");
  const steps = t.raw("howTo.steps") as string[];
  const encodingItems = t.raw("encoding.items") as string[];
  const mistakes = t.raw("mistakes.items") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#article`,
        headline: t("title"),
        description: t("meta.description"),
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        inLanguage: locale === "zh-cn" ? "zh-Hans" : locale,
        about: { "@type": "Thing", name: "TON blockchain address" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumbHome"),
            item: converterUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("breadcrumbCurrent"),
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-10">
      <nav aria-label="Breadcrumb" className="text-sm text-default-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={getLocaleHref(locale)} className="hover:text-primary underline-offset-4 hover:underline">
              {t("breadcrumbHome")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-default-600">
            {t("breadcrumbCurrent")}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-default-500 leading-relaxed">{t("intro")}</p>
        <Link
          href={getLocaleHref(locale)}
          className="self-start rounded-medium bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("cta")}
        </Link>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("anatomy.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("anatomy.body")}</p>

        <h3 className="text-lg font-semibold">{t("anatomy.rawTitle")}</h3>
        <p className="text-default-500 leading-relaxed">{t("anatomy.rawBody")}</p>
        <code className="block break-all rounded-medium bg-default-100 px-3 py-2 font-mono text-xs sm:text-sm">
          {EXAMPLE.raw}
        </code>

        <h3 className="text-lg font-semibold">{t("anatomy.friendlyTitle")}</h3>
        <p className="text-default-500 leading-relaxed">{t("anatomy.friendlyBody")}</p>

        <Table>
          <thead className="bg-default-100 text-default-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">{t("anatomy.col.part")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("anatomy.col.size")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("anatomy.col.meaning")}</th>
            </tr>
          </thead>
          <tbody>
            {ANATOMY_ROWS.map((row) => (
              <tr key={row.key} className="border-t border-divider align-top">
                <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">
                  {t(`anatomy.part.${row.key}`)}
                </th>
                <td className="px-3 py-2 font-mono whitespace-nowrap">{row.size}</td>
                <td className="px-3 py-2 text-default-500">{t(`anatomy.meaning.${row.key}`)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("prefixes.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("prefixes.body")}</p>

        <Table>
          <thead className="bg-default-100 text-default-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">{t("prefixes.col.prefix")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("prefixes.col.network")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("prefixes.col.bounceable")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("prefixes.col.workchain")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("prefixes.col.use")}</th>
            </tr>
          </thead>
          <tbody>
            {PREFIX_ROWS.map((row) => (
              <tr key={row.prefix} className="border-t border-divider align-top">
                <th scope="row" className="px-3 py-2 font-mono font-semibold">{row.prefix}</th>
                <td className="px-3 py-2 whitespace-nowrap">
                  {t(`prefixes.network.${row.testnet ? "testnet" : "mainnet"}`)}
                </td>
                <td className="px-3 py-2">{row.bounceable ? t("prefixes.yes") : t("prefixes.no")}</td>
                <td className="px-3 py-2 whitespace-nowrap">{t(`prefixes.chain.${row.chain}`)}</td>
                <td className="px-3 py-2 text-default-500">{t(`prefixes.use.${row.use}`)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("examples.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("examples.body")}</p>

        <Table>
          <thead className="bg-default-100 text-default-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">{t("examples.col.format")}</th>
              <th scope="col" className="px-3 py-2 font-medium">{t("examples.col.example")}</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLE_KEYS.map((key) => (
              <tr key={key} className="border-t border-divider align-top">
                <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">
                  {t(`examples.label.${key}`)}
                </th>
                <td className="px-3 py-2">
                  <code className="break-all font-mono text-xs sm:text-sm">{EXAMPLE[key]}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("encoding.title")}</h2>
        <ul className="flex flex-col gap-3 list-disc pl-5 text-default-500 leading-relaxed">
          {encodingItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("howTo.title")}</h2>
        <ol className="flex flex-col gap-3 list-decimal pl-5 text-default-500 leading-relaxed">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <Link
          href={getLocaleHref(locale)}
          className="self-start rounded-medium bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("backToConverter")}
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("mistakes.title")}</h2>
        <dl className="flex flex-col gap-6">
          {mistakes.map((item, index) => (
            <div key={index}>
              <dt className="text-lg font-semibold mb-1">{item.q}</dt>
              <dd className="text-default-500 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
};
