'use client';

import { LOCALE_EMOJI, LOCALE_LABELS, LocaleKey, LOCALES } from "@/i18n/constants";
import { Link } from "@/i18n/routing";
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useLocale } from "next-intl";

export const ApplicationLayoutLangSelectorDropdown = () => {
  const locale = useLocale() as LocaleKey;

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
            <Link locale={l} href="/" className="block w-full px-2 py-1.5">
              {LOCALE_EMOJI[l]} {LOCALE_LABELS[l]}
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )

}