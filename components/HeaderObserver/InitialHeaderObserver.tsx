'use client'

import * as React from 'react'

import { useTheme } from '@components/providers/Theme'
import { usePathname } from 'next/navigation'
import { HeaderObserver } from '.'

export const InitialHeaderObserver: React.FC = () => {
  const theme = useTheme()
  const pathname = usePathname()

  return <HeaderObserver key={pathname} color={theme} watch={false} />
}
