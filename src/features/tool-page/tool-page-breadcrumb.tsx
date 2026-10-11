import Link from "next/link";
import type { LocaleKey } from "@/i18n/constants";
import { getLocaleHref } from "@/shared/utils/path";
import { TonAppBadge } from "@/features/ton-app-badge/ton-app-badge";

type Props = {
  locale: LocaleKey;
  home: string;
  current: string;
};

/** Home → current page trail with the TON App badge, shared by every tool page. */
export const ToolPageBreadcrumb = ({ locale, home, current }: Props) => (
  <div className="flex items-center justify-between gap-4">
    <nav aria-label="Breadcrumb" className="text-sm text-default-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            href={getLocaleHref(locale)}
            className="hover:text-primary underline-offset-4 hover:underline"
          >
            {home}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-default-600">
          {current}
        </li>
      </ol>
    </nav>
    <TonAppBadge size="inline" className="shrink-0" />
  </div>
);
