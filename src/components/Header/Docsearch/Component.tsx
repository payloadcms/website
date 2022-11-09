import React from 'react'
import { DocSearch } from '@docsearch/react'

function Component() {
  return (
    <DocSearch
      appId="BH4D9OD16A"
      indexName="payloadcms"
      apiKey={process.env.NEXT_PUBLICg_ALGOLIA_DOCSEARCH_KEY}
    />
  )
}

export default Component
