"use client";

import { useMemo, useState } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useTranslations } from "next-intl";
import Link from "next/link";

import type { LocaleKey } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";
import type { FaqItem } from "@/features/faq/faq";
import { ToolPageBreadcrumb } from "@/features/tool-page/tool-page-breadcrumb";
import { FaqList } from "@/features/tool-page/faq-list";
import { buildToolPageGraph, JsonLd } from "@/features/tool-page/json-ld";
import { CopyButton, copyToClipboard } from "@/shared/ui/copy-button";
import { checkAddress, EXAMPLE_ADDRESS, type AddressForms } from "@/features/address-checker/validate";

/** Official TON testnet faucet bot, as linked from docs.ton.org. */
const FAUCET_BOT_URL = "https://t.me/testgiver_ton_bot";
const TESTNET_EXPLORER = "https://testnet.tonviewer.com/";

/** The faucet bot and testnet wallets display the non-bounceable form. */
const FAUCET_FORM: keyof AddressForms = "testnetNonBounceable";

const FORM_ROWS: { key: keyof AddressForms; network: "testnet" | "mainnet" }[] = [
  { key: "testnetNonBounceable", network: "testnet" },
  { key: "testnetBounceable", network: "testnet" },
  { key: "nonBounceable", network: "mainnet" },
  { key: "bounceable", network: "mainnet" },
  { key: "raw", network: "mainnet" },
];

type Props = {
  locale: LocaleKey;
  /** Absolute URL of this page, used by the JSON-LD. */
  pageUrl: string;
  /** Absolute URL of the converter, used by the breadcrumb JSON-LD. */
  converterUrl: string;
};

export const TestnetPage = ({ locale, pageUrl, converterUrl }: Props) => {
  const t = useTranslations("testnet");
  const tc = useTranslations("checker");
  const [raw, setRaw] = useState("");
  const [copiedFor, setCopiedFor] = useState("");

  const result = checkAddress(raw);
  const faucetAddress = result.status === "valid" ? result.forms[FAUCET_FORM] : "";
  const copied = faucetAddress !== "" && copiedFor === faucetAddress;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRaw(text);
      }
    } catch {
      // Clipboard read denied — the user can still paste into the field.
    }
  };

  /**
   * Copy first, then open the bot: the user lands in Telegram with the address
   * already on the clipboard, which is the only thing the bot asks for.
   */
  const handleCopyAndOpen = async () => {
    if (await copyToClipboard(faucetAddress)) {
      setCopiedFor(faucetAddress);
    }
    window.open(FAUCET_BOT_URL, "_blank", "noopener,noreferrer");
  };

  const faucetSteps = t.raw("faucet.steps") as string[];
  const walletSteps = t.raw("wallet.steps") as string[];
  const faq = t.raw("faq.items") as FaqItem[];

  // Static per locale — kept out of the per-keystroke render path.
  const jsonLd = useMemo(
    () =>
      buildToolPageGraph({
        locale,
        pageUrl,
        converterUrl,
        name: t("title"),
        description: t("meta.description"),
        breadcrumbHome: t("breadcrumbHome"),
        breadcrumbCurrent: t("breadcrumbCurrent"),
        category: "DeveloperApplication",
        faq: t.raw("faq.items") as FaqItem[],
        featureList: [
          "Mainnet to testnet address conversion (EQ/UQ to kQ/0Q)",
          "Testnet to mainnet address conversion",
          "TON testnet faucet guide",
        ],
        extra: [
          {
            "@type": "HowTo",
            "@id": `${pageUrl}#howto`,
            name: t("faucet.title"),
            step: (t.raw("faucet.steps") as string[]).map((text, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              text,
            })),
          },
        ],
      }),
    [t, locale, pageUrl, converterUrl]
  );

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-10">
      <ToolPageBreadcrumb
        locale={locale}
        home={t("breadcrumbHome")}
        current={t("breadcrumbCurrent")}
      />

      <header className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-default-500 leading-relaxed">{t("description")}</p>
        <ol className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
          {(["step1", "step2"] as const).map((step, index) => {
            const done = index === 0 && result.status === "valid";

            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done ? "bg-success text-success-foreground" : "bg-default-200 text-default-600"
                  }`}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span className={done ? "text-default-400" : "text-default-600"}>
                  {t(`flow.${step}`)}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("converter.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("converter.body")}</p>

        <Input
          value={raw}
          variant="bordered"
          size="lg"
          label={t("converter.inputLabel")}
          placeholder={tc("inputPlaceholder")}
          onValueChange={setRaw}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          classNames={{ input: "font-mono text-sm" }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="flat" color="primary" onPress={handlePaste}>
            {t("converter.paste")}
          </Button>
          <Button size="sm" variant="light" onPress={() => setRaw(EXAMPLE_ADDRESS)}>
            {tc("loadExample")}
          </Button>
          <Button size="sm" variant="light" isDisabled={!raw} onPress={() => setRaw("")}>
            {tc("clear")}
          </Button>
        </div>

        {result.status === "empty" && (
          <div className="rounded-large border border-dashed border-divider px-4 py-8 text-center text-sm text-default-400">
            {tc("emptyHint")}
          </div>
        )}

        {result.status === "invalid" && (
          <div className="rounded-large border border-danger-200 bg-danger-50 dark:bg-danger-50/10 px-4 py-4 flex flex-col gap-1">
            <p className="font-semibold text-danger">{tc("status.invalid")}</p>
            <p className="text-sm text-default-600 leading-relaxed">
              {tc(`issue.${result.issue.code}`, result.issue.params)}
            </p>
          </div>
        )}

        {result.status === "valid" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-large border border-success-200 bg-success-50 dark:bg-success-50/10 px-4 py-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-default-500">
                  {t("converter.faucetAddress")}
                </span>
                <div className="flex items-center gap-1.5">
                  <code className="break-all font-mono text-sm sm:text-base font-medium">
                    {faucetAddress}
                  </code>
                  <CopyButton value={faucetAddress} />
                </div>
                <span className="text-xs text-default-500">
                  {result.network === "testnet"
                    ? t("converter.alreadyTestnet")
                    : t("converter.converted")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button color="primary" onPress={handleCopyAndOpen}>
                  {t("converter.copyAndOpen")}
                </Button>
                {copied && (
                  <span className="text-sm text-success-600 dark:text-success">
                    {t("converter.copiedHint")}
                  </span>
                )}
              </div>
            </div>

            <details className="group rounded-medium border border-divider">
              <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-default-600 marker:text-default-400">
                {t("converter.allForms")}
              </summary>
              <div className="overflow-x-auto border-t border-divider">
                <table className="w-full text-left text-sm border-collapse">
                  <tbody>
                    {FORM_ROWS.map(({ key, network }) => (
                      <tr
                        key={key}
                        className={`border-b border-divider last:border-b-0 ${
                          key === FAUCET_FORM ? "bg-default-50" : ""
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-3 py-2 font-medium whitespace-nowrap text-default-500 align-top"
                        >
                          <span className={network === "testnet" ? "text-warning-600 dark:text-warning" : undefined}>
                            {tc(`forms.${key}`)}
                          </span>
                        </th>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <code className="break-all font-mono text-xs sm:text-sm">
                              {result.forms[key]}
                            </code>
                            <CopyButton value={result.forms[key]} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <a
              href={`${TESTNET_EXPLORER}${result.forms.testnetNonBounceable}`}
              target="_blank"
              rel="noreferrer"
              className="self-start text-sm text-primary underline-offset-4 hover:underline"
            >
              {t("converter.openTestnetExplorer")}
            </a>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("faucet.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("faucet.body")}</p>
        <ol className="flex flex-col gap-3 list-decimal pl-5 text-default-500 leading-relaxed">
          {faucetSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <p className="text-sm text-default-400 leading-relaxed">{t("faucet.note")}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("wallet.title")}</h2>
        <p className="text-default-500 leading-relaxed">{t("wallet.body")}</p>
        <ul className="flex flex-col gap-3 list-disc pl-5 text-default-500 leading-relaxed">
          {walletSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t("faq.title")}</h2>
        <FaqList items={faq} />
      </section>

      <section className="flex flex-wrap gap-3">
        <Link
          href={getLocaleHref(locale, "/ton-wallet-address-checker")}
          className="rounded-medium bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("checkerCta")}
        </Link>
        <Link
          href={getLocaleHref(locale, "/ton-address-format")}
          className="rounded-medium border border-divider px-4 py-2 text-sm font-medium"
        >
          {t("guideCta")}
        </Link>
      </section>

      <JsonLd data={jsonLd} />
    </article>
  );
};
