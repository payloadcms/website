import { DocSearch } from '@docsearch/react'
import { usePathname } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

function Hit({ children, hit, path }) {
  const blog = hit?.url?.includes('/blog/') || false

  let url = hit?.url

  const docsVersion = path.match(/^\/docs\/(beta|v2)(?=\/)/)?.[1]

  if (docsVersion) {
    url = url.replace('/docs/', `/docs/${docsVersion}/`)
  }

  return (
    <a className={blog ? classes.blogResult : ''} href={url}>
      {children}
    </a>
  )
}

function Component() {
  const path = usePathname()
  return (
    <DocSearch
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      appId="9MJY7K9GOW"
      hitComponent={({ children, hit }) => Hit({ children, hit, path })}
      indexName="payloadcms"
    />
  )
}

export default Component
