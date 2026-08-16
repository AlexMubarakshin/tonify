'use client';

import { LOCALE_EMOJI, LOCALE_HREFLANG, LOCALE_LABELS, LocaleKey, LOCALES } from "@/i18n/constants";
import { getLocaleHref, stripLocaleFromPath } from "@/shared/utils/path";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  locale: LocaleKey
}

export const ApplicationLayoutLangSelectorDropdown = ({ locale }: Props) => {
  // `usePathname` already excludes the basePath; strip the locale segment so
  // switching language keeps the reader on the same page instead of the home page.
  const path = stripLocaleFromPath(usePathname());

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light">{LOCALE_EMOJI[locale]} {LOCALE_LABELS[locale]}</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {Object.values(LOCALES).map((l) => (
          <DropdownItem
            key={l}
            className="p-0"
          >
            <Link
              href={getLocaleHref(l, path)}
              hrefLang={LOCALE_HREFLANG[l]}
              className="block w-full px-2 py-1.5"
            >
              {LOCALE_EMOJI[l]} {LOCALE_LABELS[l]}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
