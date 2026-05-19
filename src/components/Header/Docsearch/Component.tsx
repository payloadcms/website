import { DocSearch } from '@docsearch/react'
import { usePathname } from 'next/navigation'
import React from 'react'

import classes from './index.module.scss'

function getVersionedUrl(url: string, path: string): string {
  if (!url) return url

  const isV2 = path.includes('/docs/v2/')

  if (isV2 && !url.includes('/docs/v2/')) {
    return url.replace('/docs/', '/docs/v2/')
  }

  if (!isV2 && url.includes('/docs/v2/')) {
    return url.replace('/docs/v2/', '/docs/')
  }

  return url
}

function Hit({ children, hit, path }: { children: React.ReactNode; hit: any; path: string }) {
  const blog = hit?.url?.includes('/blog/') || false
  const url = getVersionedUrl(hit?.url, path)

  return (
    <a className={blog ? classes.blogResult : ''} href={url}>
      {children}
    </a>
  )
}

function Component() {
  const path = usePathname()
  const isV2 = path.includes('/docs/v2/')
  return (
    <div className={classes.searchWrapper}> 
    <DocSearch
      apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''}
      appId="9MJY7K9GOW"
      hitComponent={({ children, hit }) => Hit({ children, hit, path })}
      indexName="payloadcms"
      searchParameters={
        isV2
          ? { facetFilters: ['version:v2'] }
          : { facetFilters: ['version:v3'] }
      }
    />
    {isV2 && (
      <div className={classes.versionBadge}>
        Searching in v2 docs
      </div>
    )}
    </div>
  )
}



export default Component
