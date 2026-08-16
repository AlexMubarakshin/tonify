import { LOCALE_EMOJI, LOCALE_HREFLANG, LOCALE_LABELS, LocaleKey, LOCALES } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";
import Link from "next/link";
import { ApplicationLayoutLangSelectorDropdown } from "./application-layout-lang-selector-dropdown";

type Props = {
  locale: LocaleKey
}

export const ApplicationLayoutLangSelector = ({ locale }: Props) => {
  return (
    <div>
      <ApplicationLayoutLangSelectorDropdown locale={locale} />

      {/*
        Crawlable counterpart of the JS-driven dropdown above. Uses `next/link`
        so the basePath is applied — plain <a href="/ru"> 404s on GitHub Pages,
        where the app is served from /tonify.
      */}
      <ul className="hidden absolute invisible opacity-0">
        {LOCALES.map((lang) => (
          <li key={`hidden-${lang}`}>
            <Link href={getLocaleHref(lang)} hrefLang={LOCALE_HREFLANG[lang]}>
              {LOCALE_EMOJI[lang]} {LOCALE_LABELS[lang]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
