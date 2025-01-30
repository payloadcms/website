'use client'

import React from 'react'

export const RenderDarkMode: React.FC<{
  children: React.ReactNode
  enableMargins?: boolean
  enablePadding?: boolean
}> = (props) => {
  const { children, enableMargins, enablePadding } = props

  return (
    <div
      style={{
        margin: enableMargins ? 'var(--block-spacing) 0' : 0,
        padding: enablePadding ? 'var(--block-spacing) 0' : 0,
      }}
    >
      {children}
    </div>
  )
}
