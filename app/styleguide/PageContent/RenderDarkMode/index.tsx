'use client'

import React from 'react'
import { Gutter } from '../../../../components/Gutter'
import { ThemeProvider, useTheme } from '../../../../components/providers/Theme'

export const RenderDarkMode: React.FC<{
  children: React.ReactNode
}> = props => {
  const { children } = props

  const theme = useTheme()

  return (
    <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
      <div
        style={{
          backgroundColor: 'var(--theme-elevation-0)',
          padding: `calc(var(--base) * 2) 0`,
        }}
      >
        <Gutter>{children}</Gutter>
      </div>
    </ThemeProvider>
  )
}
