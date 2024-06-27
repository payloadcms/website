'use client'

import React from 'react'

export const RenderDarkMode: React.FC<{
  children: React.ReactNode
  enablePadding?: boolean
  enableMargins?: boolean
}> = props => {
  const { children, enablePadding, enableMargins } = props

  return (
    <div
      style={{
        padding: enablePadding ? 'var(--block-spacing) 0' : 0,
        margin: enableMargins ? 'var(--block-spacing) 0' : 0,
      }}
    >
      {children}
    </div>
  )
}
