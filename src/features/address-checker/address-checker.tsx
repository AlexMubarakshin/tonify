"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useTranslations } from "next-intl";
import Link from "next/link";

import type { LocaleKey } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";
import { checkAddress, explorerUrl, EXAMPLE_ADDRESS } from "./validate";
import { AddressCheckerVerdict } from "./address-checker-verdict";
import { AddressCheckerOnChain } from "./address-checker-on-chain";

const ExternalLinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </svg>
);

type WalletGuide = { wallet: string; steps: string };
type FaqItem = { q: string; a: string };

type Props = {
  locale: LocaleKey;
  /** Absolute URL of this page, used by the JSON-LD. */
  pageUrl: string;
  /** Absolute URL of the converter, used by the breadcrumb JSON-LD. */
  converterUrl: string;
};

export const AddressChecker = ({ locale, pageUrl, converterUrl }: Props) => {
  const t = useTranslations("checker");
  const [raw, setRaw] = useState("");

  const result = useMemo(() => checkAddress(raw), [raw]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRaw(event.target.value);
  }, []);

  const steps = t.raw("howTo.steps") as string[];
  const checks = t.raw("checks.items") as string[];
  const wallets = t.raw("where.items") as WalletGuide[];
  const faq = t.raw("faq.items") as FaqItem[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: t("title"),
        url: pageUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description: t("meta.description"),
        inLanguage: locale === "zh-cn" ? "zh-Hans" : locale,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "TON address checksum validation",
          "EQ / UQ / kQ / 0Q prefix detection",
          "Raw address validation",
          "Testnet address detection",
          "Wrong-blockchain detection",
          "Optional on-chain account lookup",
        ],
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
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-10">
      <nav aria-label="Breadcrumb" className="text-sm text-default-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={getLocaleHref(locale)}
              className="hover:text-primary underline-offset-4 hover:underline"
            >
              {t("breadcrumbHome")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-default-600">
            {t("breadcrumbCurrent")}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-default-500 leading-relaxed">{t("description")}</p>
      </header>

      <section className="flex flex-col gap-4">
        <Input
          value={raw}
          variant="bordered"
          size="lg"
          label={t("inputLabel")}
          placeholder={t("inputPlaceholder")}
          onChange={handleChange}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          classNames={{ input: "font-mono text-sm" }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => setRaw(EXAMPLE_ADDRESS)}
          >
            {t("loadExample")}
          </Button>
          <Button
            size="sm"
            variant="light"
            isDisabled={!raw}
            onPress={() => setRaw("")}
          >
            {t("clear")}
          </Button>
        </div>

        <AddressCheckerVerdict result={result} />

        {result.status === "valid" && (
          <div className="flex flex-col gap-4 rounded-large border border-divider px-4 py-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">{t("onchain.title")}</h2>
              <p className="text-sm text-default-500 leading-relaxed">
                {t("onchain.description")}
              </p>
            </div>

            <AddressCheckerOnChain
              address={result.lookup}
              disabled={result.network === "testnet"}
            />

            <a
              href={explorerUrl(result.lookup)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 self-start text-sm text-primary underline-offset-4 hover:underline"
            >
              {t("openInExplorer")}
              <ExternalLinkIcon />
            </a>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("howTo.title")}</h2>
        <ol className="flex flex-col gap-3 list-decimal pl-5 text-default-500 leading-relaxed">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("checks.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("checks.body")}</p>
        <ul className="flex flex-col gap-3 list-disc pl-5 text-default-500 leading-relaxed">
          {checks.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("example.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("example.body")}</p>
        <code className="block break-all rounded-medium bg-default-100 px-3 py-2 font-mono text-xs sm:text-sm">
          {EXAMPLE_ADDRESS}
        </code>
        <p className="text-default-500 leading-relaxed">{t("example.prefixes")}</p>
        <Link
          href={getLocaleHref(locale, "/ton-address-format")}
          className="self-start text-sm text-primary underline-offset-4 hover:underline"
        >
          {t("example.guideCta")}
        </Link>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("where.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("where.body")}</p>
        <dl className="flex flex-col gap-4">
          {wallets.map((item, index) => (
            <div key={index}>
              <dt className="font-semibold mb-1">{item.wallet}</dt>
              <dd className="text-default-500 leading-relaxed">{item.steps}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("faq.title")}</h2>
        <dl className="flex flex-col gap-6">
          {faq.map((item, index) => (
            <div key={index}>
              <dt className="text-lg font-semibold mb-1">{item.q}</dt>
              <dd className="text-default-500 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href={getLocaleHref(locale)}
          className="rounded-medium bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("converterCta")}
        </Link>
        <Link
          href={getLocaleHref(locale, "/ton-address-format")}
          className="rounded-medium border border-divider px-4 py-2 text-sm font-medium"
        >
          {t("guideCta")}
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
};
