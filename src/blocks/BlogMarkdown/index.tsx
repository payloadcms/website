import React from 'react'
import dynamic from 'next/dynamic'

const Block = dynamic(() => import('./Block.js'), {
  suspense: true,
})

export function BlogMarkdown(props) {
  return (
    <React.Suspense>
      <Block {...props} />
    </React.Suspense>
  )
}
