'use client'

import { useTheme } from '@providers/Theme'

import { HeaderObserver } from '@components/HeaderObserver'

export const RenderLayout = ({ children }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      {children}
    </HeaderObserver>
  )
}
