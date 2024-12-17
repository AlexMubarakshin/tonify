'use client'

import { NextUIProvider } from '@nextui-org/react'

export async function Providers({ children }: { children: React.ReactNode }) {

  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}