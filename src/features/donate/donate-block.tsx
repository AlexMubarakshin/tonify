"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/shared/ui/copy-button";
import { getAssetPath } from "@/shared/utils/path";
import {
  DEFAULT_DONATE_TIER,
  DONATE_ADDRESS,
  DONATE_TIERS,
  donateHref,
  donateQrSrc,
} from "./constants";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);

type Props = {
  /**
   * Set once the visitor has actually exported a file. Someone who converted a
   * batch and took it away got real value, which is a better moment to ask than
   * page load, so the block acknowledges the download instead of appearing cold.
   */
  downloaded?: boolean;
};

/**
 * Donation prompt, shown inline rather than as a modal or an overlay.
 *
 * The two breakpoints are genuinely different flows, not one layout reflowing:
 * on a phone the visitor has a wallet app, so a tier is a link that hands off
 * to it with the amount already set. On a desktop there is usually no wallet to
 * open, so a tier instead selects which pre-generated QR to show and the
 * transfer finishes on a phone.
 */
export const DonateBlock = ({ downloaded = false }: Props) => {
  const t = useTranslations("donate");
  const [selected, setSelected] = useState(DEFAULT_DONATE_TIER);

  return (
    <section
      aria-labelledby="donate-title"
      className={`rounded-large border p-5 sm:p-6 ${
        downloaded
          ? "border-success-200 bg-success-50/50 dark:bg-success-50/10"
          : "border-divider bg-default-50/60"
      }`}
    >
      {downloaded && (
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-success-700 dark:text-success">
          <CheckIcon />
          {t("downloaded")}
        </p>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="donate-title" className="text-lg font-semibold tracking-tight">
              {t("title")}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-default-500">
              {t("description")}
            </p>
          </div>

          {/* Phone: the tier itself is the call to action, straight into the wallet. */}
          <div className="grid grid-cols-3 gap-2 sm:hidden">
            {DONATE_TIERS.map((ton) => (
              <a
                key={ton}
                href={donateHref(ton)}
                className="flex min-h-11 items-center justify-center rounded-medium border border-primary px-2 text-sm font-medium text-primary"
              >
                {ton} GRAM
              </a>
            ))}
          </div>

          {/* Desktop: the tier picks the QR instead of navigating away. */}
          <div role="radiogroup" aria-label={t("amountGroup")} className="hidden gap-2 sm:flex">
            {DONATE_TIERS.map((ton) => {
              const isSelected = ton === selected;

              return (
                <button
                  key={ton}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(ton)}
                  className={`min-h-11 rounded-medium border px-5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-divider text-default-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {ton} GRAM
                </button>
              );
            })}
          </div>

          <a
            href={donateHref(selected)}
            target="_blank"
            rel="noreferrer"
            className="hidden self-start text-sm text-primary underline-offset-4 hover:underline sm:inline-block"
          >
            {t("openInWallet")}
          </a>

          <div className="flex flex-col gap-1.5 border-t border-divider pt-3">
            <span className="text-xs text-default-500">{t("addressLabel")}</span>
            {/*
              Shown in full, never middle-truncated. This site exists to tell
              people when a TON address is not what they think it is, so asking
              them to trust an abbreviated one would undercut the whole point.
            */}
            <div className="flex items-start gap-2">
              <code className="min-w-0 break-all font-mono text-xs leading-relaxed text-default-600">
                {DONATE_ADDRESS}
              </code>
              <CopyButton value={DONATE_ADDRESS} />
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-center gap-2 sm:flex">
          {/*
            Kept light in both themes on purpose: an inverted QR scans less
            reliably, so the code carries its own white field rather than
            following the page background.
          */}
          <div className="rounded-medium border border-divider bg-white p-2">
            <Image
              src={getAssetPath(donateQrSrc(selected))}
              alt={t("qrAlt", { ton: selected })}
              width={132}
              height={132}
            />
          </div>
          <span className="text-xs text-default-500">{t("scanHint")}</span>
        </div>
      </div>
    </section>
  );
};
