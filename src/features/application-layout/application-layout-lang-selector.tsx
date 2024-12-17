import { LOCALE_EMOJI, LOCALE_LABELS, LOCALES } from "@/i18n/constants";
import { ApplicationLayoutLangSelectorDropdown } from "./application-layout-lang-selector-dropdown";

export const ApplicationLayoutLangSelector = () => {
  return (
    <div>

      <ApplicationLayoutLangSelectorDropdown />

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