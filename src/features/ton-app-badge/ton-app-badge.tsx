"use client";

// Every component in this app that calls `useTranslations` is a client component:
// messages arrive through the `NextIntlClientProvider` in `Application`. As a server
// component this would instead resolve the locale through `i18n/request.ts`, which
// reads `headers()` and so bails the statically exported routes out of prerendering.
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { getAssetPath } from '@/shared/utils/path';

/**
 * `inline` sits at the end of an existing row (the article breadcrumbs) and must
 * stay small enough not to set that row's height. `standalone` is the only thing
 * on its line, so it can be read from further away.
 */
type Size = 'inline' | 'standalone';

const SIZES: Record<Size, { width: number; height: number; loading: 'eager' | 'lazy' }> = {
  // `inline` sits above the fold on the article pages, `standalone` below it.
  inline: { width: 84, height: 36, loading: 'eager' },
  standalone: { width: 103, height: 44, loading: 'lazy' },
};

type Props = {
  size?: Size;
  className?: string;
}

/**
 * Social-proof badge for the TONify listing on ton.app.
 *
 * The badge artwork is self-hosted (`public/ton-app-badge.svg`, an SVGO-minified
 * copy of https://ton.app/a2/badge/topapp?appId=5871) so the page does not depend
 * on a third-party request. That freezes the ranking shown on it — re-download and
 * re-minify the SVG when the position on ton.app changes.
 *
 * The outbound link is `nofollow` so the reciprocal badge link passes no PageRank.
 * The stored SVG's viewBox is cropped to the artwork's own bounds, so the 171x74
 * intrinsic box carries no dead margin and the badge lines up optically with
 * whatever sits beside it.
 */
export const TonAppBadge = ({ size = 'standalone', className }: Props) => {
  const t = useTranslations();

  return (
    <a
      className={className}
      href="https://ton.app/devtools/tonify?id=5871"
      target="_blank"
      rel="nofollow noopener"
      title={t('tonApp.title')}
    >
      <Image
        src={getAssetPath('/ton-app-badge.svg')}
        {...SIZES[size]}
        alt={t('tonApp.alt')}
      />
    </a>
  );
};
