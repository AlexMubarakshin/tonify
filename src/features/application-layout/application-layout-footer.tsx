"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { LocaleKey } from "@/i18n/constants";
import { getAssetPath, getLocaleHref } from "@/shared/utils/path";
import { DEFAULT_DONATE_TIER, donateHref } from "@/features/donate/constants";

/** Every tool page, in the order they are listed. Keys map to `footer.links`. */
const TOOL_LINKS = [
  { key: "converter", path: "/" },
  { key: "checker", path: "/ton-wallet-address-checker" },
  { key: "guide", path: "/ton-address-format" },
  { key: "testnet", path: "/ton-testnet-faucet" },
  { key: "stars", path: "/telegram-stars-to-ton" },
] as const;

const REPO_URL = "https://github.com/AlexMubarakshin/tonify";
const AUTHOR_URL = "https://github.com/AlexMubarakshin";

type Props = {
  locale: LocaleKey;
};

/**
 * Site-wide tool links. Static HTML, so every page passes link equity to every
 * other tool — the site has no other navigation.
 */
export const ApplicationLayoutFooter = ({ locale }: Props) => {
  const t = useTranslations("footer");
  const tDonate = useTranslations("donate");
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <footer className="border-t border-divider bg-default-50/60">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 flex flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href={getLocaleHref(locale)} className="flex items-center gap-2 self-start">
              <Image src={getAssetPath("/logo.png")} width={32} height={32} alt="" />
              <span className="text-lg font-bold tracking-tight">TONify</span>
            </Link>
            <p className="text-sm text-default-500 leading-relaxed">{t("tagline")}</p>
          </div>

          <nav aria-label={t("title")} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-default-400">
              {t("title")}
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2.5 text-sm">
              {TOOL_LINKS.map((link) => {
                const href = getLocaleHref(locale, link.path);
                const isCurrent = pathname === href;

                return (
                  <li key={link.key}>
                    <Link
                      href={href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={
                        isCurrent
                          ? "font-medium text-foreground"
                          : "text-default-500 hover:text-primary transition-colors"
                      }
                    >
                      {t(`links.${link.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-divider pt-5 text-xs text-default-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()}{" "}
            <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="hover:text-primary">
              Alex Mubarakshin
            </a>
          </span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href={donateHref(DEFAULT_DONATE_TIER)}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {tDonate("footerLink")}
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-primary">
              {t("openSource")}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
