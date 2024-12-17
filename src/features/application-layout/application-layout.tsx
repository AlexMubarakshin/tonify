import { getAssetPath } from '@/shared/utils/path';
import Image from 'next/image';

import { PropsWithChildren } from "react";
import { ApplicationLayoutLangSelector } from './application-layout-lang-selector';

export const ApplicationLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-white border-b border-gray-200 ">
      <div className="flex items-center px-6 py-1 justify-between w-full">
        <div className="flex flex-row items-center">

          <Image
            className='mr-2 w-[48px] h-[48px]'
            src={getAssetPath('/logo.png')}
            width={48}
            height={48}
            alt="TONify's logo"
          />
          <h3 className="text-2xl font-bold">TONify</h3>
        </div>

        <div>
          <ApplicationLayoutLangSelector />
        </div>
      </div>
    </header>

    <main className="flex-grow">
      {children}
    </main>
  </div>
)