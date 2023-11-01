import React from 'react'
import { DocSearch } from '@docsearch/react'

import classes from './index.module.scss'

function Hit({ hit, children }) {
  const blog = hit?.url?.includes('/blog/') || false
  return (
    <a className={blog ? classes.blogResult : ''} href={hit?.url}>
      {children}
    </a>
  )
}

function Component() {
  return (
    <DocSearch
      appId="9MJY7K9GOW"
      indexName="payloadcms"
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      hitComponent={Hit}
    />
  )
}

export default Component
