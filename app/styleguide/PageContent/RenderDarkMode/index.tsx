'use client'

import React from 'react'
import { ThemeProvider, useTheme } from '../../../../components/providers/Theme'

export const RenderDarkMode: React.FC<{
  children: React.ReactNode
  enablePadding?: boolean
  enableMargins?: boolean
}> = props => {
  const { children, enablePadding, enableMargins } = props

  const theme = useTheme()

  return (
    <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
      <div
        style={{
          backgroundColor: 'var(--theme-bg)',
          padding: enablePadding ? 'var(--block-spacing) 0' : 0,
          margin: enableMargins ? 'var(--block-spacing) 0' : 0,
        }}
      >
        {children}
      </div>
    </ThemeProvider>
  )
}
