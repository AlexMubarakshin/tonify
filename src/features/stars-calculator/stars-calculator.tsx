"use client";

import { ChangeEvent, FocusEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import type { LocaleKey } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";
import type { FaqItem } from "@/features/faq/faq";
import { ToolPageBreadcrumb } from "@/features/tool-page/tool-page-breadcrumb";
import { FaqList } from "@/features/tool-page/faq-list";
import { buildToolPageGraph, JsonLd } from "@/features/tool-page/json-ld";
import { CopyButton } from "@/shared/ui/copy-button";
import { fetchTonUsdPrice } from "./ton-price";

/**
 * USD value of one Star. `withdraw` is the rate Telegram pays bots and channels
 * when Stars are withdrawn as TON through Fragment; `buy` is roughly what a user
 * pays for a small Stars pack in the app. Both are editable in the UI.
 */
const STAR_RATES = {
  withdraw: 0.013,
  buy: 0.02,
} as const;

type RateKey = keyof typeof STAR_RATES;
type RateMode = RateKey | "custom";

const RATE_MODES: RateMode[] = ["withdraw", "buy", "custom"];

const PRESETS = [50, 100, 500, 1000, 2500, 10000];

/** Stars are whole units; anything past this is a typo, not a balance. */
const MAX_STARS = 1_000_000_000;

type PriceState =
  | { phase: "loading" }
  | { phase: "live"; price: number }
  | { phase: "failed" };

type Props = {
  locale: LocaleKey;
  pageUrl: string;
  converterUrl: string;
};

function parsePositive(value: string): number | null {
  const number = Number(value.replace(",", "."));

  return Number.isFinite(number) && number > 0 ? number : null;
}

/** Focusing a prefilled field selects it, so typing replaces instead of appending. */
const selectOnFocus = (event: FocusEvent<HTMLInputElement>) => event.target.select();

function formatNumber(value: number, maxFraction: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: maxFraction });
}

/** Enough significant digits to show a sub-cent per-Star value meaningfully. */
function formatSmall(value: number): string {
  return value.toLocaleString("en-US", { maximumSignificantDigits: 3 });
}

export const StarsCalculator = ({ locale, pageUrl, converterUrl }: Props) => {
  const t = useTranslations("stars");
  const [stars, setStars] = useState(1000);
  const [rateMode, setRateMode] = useState<RateMode>("withdraw");
  const [customRate, setCustomRate] = useState("");
  const [priceState, setPriceState] = useState<PriceState>({ phase: "loading" });
  const [editingPrice, setEditingPrice] = useState(false);
  const [manualPrice, setManualPrice] = useState("");

  useEffect(() => {
    let active = true;

    fetchTonUsdPrice()
      .then((price) => active && setPriceState({ phase: "live", price }))
      .catch(() => active && setPriceState({ phase: "failed" }));

    return () => {
      active = false;
    };
  }, []);

  const livePrice = priceState.phase === "live" ? priceState.price : null;
  const manual = parsePositive(manualPrice);
  const tonUsd = manual ?? livePrice;
  const starUsd = rateMode === "custom" ? parsePositive(customRate) : STAR_RATES[rateMode];

  const usd = stars > 0 && starUsd !== null ? stars * starUsd : null;
  const tonPerStar = starUsd !== null && tonUsd ? starUsd / tonUsd : null;
  const tonText = usd !== null && tonUsd ? formatNumber(usd / tonUsd, 4) : null;

  const handleStarsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    setStars(digits ? Math.min(Number(digits), MAX_STARS) : 0);
  };

  const selectCustom = () => {
    // Seed the field with whatever rate was active so editing starts from it.
    if (rateMode !== "custom" && !customRate) {
      setCustomRate(String(STAR_RATES[rateMode]));
    }
    setRateMode("custom");
  };

  // The live price failing leaves no TON figure, so open the field for them.
  const showPriceInput = editingPrice || priceState.phase === "failed";

  const steps = t.raw("howTo.steps") as string[];
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
        category: "FinanceApplication",
        faq: t.raw("faq.items") as FaqItem[],
      }),
    [t, locale, pageUrl, converterUrl]
  );

  let tonCell: ReactNode = "—";
  if (tonText !== null) {
    tonCell = (
      <>
        {tonText} GRAM
        <CopyButton value={tonText.replace(/,/g, "")} />
      </>
    );
  } else if (priceState.phase === "loading") {
    tonCell = <Spinner size="sm" />;
  }

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
      </header>

      <section className="flex flex-col gap-4">
        <Input
          type="text"
          inputMode="numeric"
          value={stars ? formatNumber(stars, 0) : ""}
          variant="bordered"
          size="lg"
          label={t("starsLabel")}
          onChange={handleStarsChange}
          autoComplete="off"
          onFocus={selectOnFocus}
          classNames={{ input: "text-lg font-mono" }}
          endContent={<span aria-hidden="true">⭐</span>}
        />

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              size="sm"
              variant={stars === preset ? "solid" : "flat"}
              color="primary"
              onPress={() => setStars(preset)}
            >
              {formatNumber(preset, 0)}
            </Button>
          ))}
        </div>

        <div
          aria-live="polite"
          className="rounded-large border border-primary-200 bg-primary-50 dark:bg-primary-50/10 px-4 py-5 flex flex-col gap-4"
        >
          {usd !== null ? (
            <>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs uppercase tracking-wide text-default-500">
                    {t("result.ton")}
                  </dt>
                  <dd className="flex items-center gap-1 text-2xl sm:text-3xl font-bold font-mono">
                    {tonCell}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5">
                  <dt className="text-xs uppercase tracking-wide text-default-500">
                    {t("result.usd")}
                  </dt>
                  <dd className="text-2xl sm:text-3xl font-bold font-mono">
                    ${formatNumber(usd, 2)}
                  </dd>
                </div>
              </dl>
              {tonPerStar !== null && starUsd !== null && (
                <p className="text-sm text-default-500 font-mono">
                  1 ⭐ = {formatSmall(tonPerStar)} GRAM = ${formatSmall(starUsd)}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-default-500">{t("result.empty")}</p>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-large border border-divider px-4 py-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("rate.title")}</span>
            <div className="flex flex-wrap gap-2">
              {RATE_MODES.map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={rateMode === mode ? "solid" : "bordered"}
                  color={rateMode === mode ? "primary" : "default"}
                  onPress={() => (mode === "custom" ? selectCustom() : setRateMode(mode))}
                >
                  {mode === "custom" ? t("rate.custom") : t(`rate.${mode}`, { usd: STAR_RATES[mode] })}
                </Button>
              ))}
            </div>
            {rateMode === "custom" ? (
              <Input
                type="text"
                inputMode="decimal"
                size="sm"
                value={customRate}
                variant="bordered"
                label={t("starUsdLabel")}
                onValueChange={setCustomRate}
                startContent={<span className="text-default-400 text-sm">$</span>}
                className="max-w-xs"
                onFocus={selectOnFocus}
                autoFocus
              />
            ) : (
              <p className="text-xs text-default-500 leading-relaxed">{t(`rate.${rateMode}Hint`)}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-divider pt-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">{t("price.title")}</span>
              {priceState.phase === "loading" && (
                <span className="text-default-500">{t("price.loading")}</span>
              )}
              {priceState.phase === "live" && (
                <span className={manual ? "text-default-400 line-through" : "text-default-600"}>
                  {t("price.live", { price: formatNumber(priceState.price, 4) })}
                </span>
              )}
              {priceState.phase === "failed" && (
                <span className="text-warning-600 dark:text-warning">{t("price.failed")}</span>
              )}
              {priceState.phase === "live" && !editingPrice && (
                <button
                  type="button"
                  onClick={() => setEditingPrice(true)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("price.edit")}
                </button>
              )}
            </div>
            {showPriceInput && (
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  type="text"
                  inputMode="decimal"
                  size="sm"
                  value={manualPrice}
                  variant="bordered"
                  label={t("tonUsdLabel")}
                  onValueChange={setManualPrice}
                  startContent={<span className="text-default-400 text-sm">$</span>}
                  className="max-w-xs"
                  onFocus={selectOnFocus}
                  autoFocus={editingPrice}
                />
                {livePrice !== null && (
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setManualPrice("");
                      setEditingPrice(false);
                    }}
                  >
                    {t("price.useLive")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-default-400 leading-relaxed">{t("disclaimer")}</p>
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
      </section>

      <JsonLd data={jsonLd} />
    </article>
  );
};
