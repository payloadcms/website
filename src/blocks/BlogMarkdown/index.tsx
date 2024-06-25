import React from 'react'
import NextDynamicImport from 'next/dynamic.js'
const dynamic = (NextDynamicImport.default ||
  NextDynamicImport) as unknown as typeof NextDynamicImport.default

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
