import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: '신자동 런처 | 창업ON케어',
    url: '/launcher',
  }),
  title: '신자동 런처 | 창업ON케어',
}

export default async function LauncherLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderObserver color="dark">
      <main>{children}</main>
    </HeaderObserver>
  )
}
