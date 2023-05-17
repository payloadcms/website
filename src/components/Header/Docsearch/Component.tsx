import React from 'react'
import { DocSearch } from '@docsearch/react'

function Component() {
  return (
    <DocSearch
      appId="9MJY7K9GOW"
      indexName="payloadcms"
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
    />
  )
}

export default Component
