'use client'

import * as React from 'react'
import { useTheme } from '@providers/Theme'

import { HeaderObserver } from '@components/HeaderObserver'

const ConstantThemeLayout = ({ children }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} isFirstObserverOnPage>
      {children}
    </HeaderObserver>
  )
}

export default ConstantThemeLayout
