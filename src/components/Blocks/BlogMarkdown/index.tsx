import Dynamic from 'next/dynamic'
import React from 'react'

const Block = Dynamic(() => import('./Block.js'))

export function BlogMarkdown(props) {
  return (
    <React.Suspense>
      <Block {...props} />
    </React.Suspense>
  )
}
