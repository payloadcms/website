'use client'

import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@components/providers/Theme'
import React from 'react'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()

  return <HeaderObserver color={theme}>{children}</HeaderObserver>
}
