import { DocSearch } from '@docsearch/react'
import React from 'react'

import classes from './index.module.scss'

function Hit({ children, hit }) {
  const blog = hit?.url?.includes('/blog/') || false
  return (
    <a className={blog ? classes.blogResult : ''} href={hit?.url}>
      {children}
    </a>
  )
}

function Component() {
  return (
    // @ts-expect-error
    <DocSearch
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      appId="9MJY7K9GOW"
      hitComponent={Hit}
      indexName="payloadcms"
    />
  )
}

export default Component
