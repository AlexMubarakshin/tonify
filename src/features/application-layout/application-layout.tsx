import { getAssetPath } from '@/shared/utils/path';
import Image from 'next/image';

import { PropsWithChildren } from "react";
import { ApplicationLayoutLangSelector } from './application-layout-lang-selector';
import { ApplicationLayoutGhWidgets } from './application-layout-gh-widgets';
import { ApplicationLayoutThemeToggle } from './application-layout-theme-toggle';
import { LocaleKey } from '@/i18n/constants';

type Props = {
  locale: LocaleKey;
}

export const ApplicationLayout = ({ children, locale }: PropsWithChildren<Props>) => (
  <div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-40 border-b border-divider bg-background/80 backdrop-blur-md backdrop-saturate-150">
      <div className="flex items-center gap-2 px-4 sm:px-6 py-2 justify-between w-full max-w-6xl mx-auto">
        <div className="flex flex-row items-center min-w-0">
          <Image
            className='mr-2 w-9 h-9 sm:w-11 sm:h-11'
            src={getAssetPath('/logo.png')}
            width={48}
            height={48}
            alt="TONify's logo"
          />
          {/* Wordmark, not a heading — an <h3> here put the document outline
              at h3 before the page's own <h1>. */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight">TONify</span>
        </div>

        <div className="flex flex-row items-center gap-1">
          <ApplicationLayoutGhWidgets className="hidden sm:flex flex-row items-center mr-1 pt-1" />
          <ApplicationLayoutThemeToggle />
          <ApplicationLayoutLangSelector locale={locale} />
        </div>
      </div>
    </header>

    <main className="flex-grow w-full">
      {children}
    </main>
  </div>
)