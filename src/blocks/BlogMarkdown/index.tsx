import React from 'react'
import Dynamic from 'next/dynamic'

const Block = Dynamic(() => import('./Block.js'), {
  suspense: true,
})

export function BlogMarkdown(props) {
  return (
    <React.Suspense>
      <Block {...props} />
    </React.Suspense>
  )
}
