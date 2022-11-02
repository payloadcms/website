'use client'

import * as React from 'react'

import { useTheme } from '@components/providers/Theme'
import { HeaderObserver } from '.'

export const InitialHeaderObserver: React.FC = () => {
  const theme = useTheme()
  return <HeaderObserver color={theme} />
}
