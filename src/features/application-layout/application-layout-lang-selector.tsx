import { LOCALE_EMOJI, LOCALE_LABELS, LocaleKey, LOCALES } from "@/i18n/constants";
import { ApplicationLayoutLangSelectorDropdown } from "./application-layout-lang-selector-dropdown";

type Props = {
  locale: LocaleKey
}

export const ApplicationLayoutLangSelector = ({locale}: Props) => {
  return (
    <div>
      <ApplicationLayoutLangSelectorDropdown locale={locale} />

      <ul className="hidden absolute invisible opacity-0">
        {LOCALES.map((lang) => (
          <li key={`hidden-${lang}`}>
            <a href={`/${lang}`}>
              {LOCALE_EMOJI[lang]} {LOCALE_LABELS[lang]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )

}