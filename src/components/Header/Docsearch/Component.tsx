import React from 'react'
import { DocSearch } from '@docsearch/react'

import classes from './index.module.scss'

function Component() {
  return (
    <div className={classes.docSearch}>
      <DocSearch
        appId="9MJY7K9GOW"
        indexName="payloadcms"
        apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      />
    </div>
  )
}

export default Component
