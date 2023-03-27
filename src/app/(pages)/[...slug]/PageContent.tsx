import React from 'react'

import { Hero } from '@components/Hero'
import Meta from '@components/Meta'
import { RenderBlocks } from '@components/RenderBlocks'
import { Page } from '@root/payload-types'

export const PageContent: React.FC<{
  page: Page
}> = ({ page }) => {
  return (
    <React.Fragment>
      <Meta title={page.meta?.title} description={page.meta?.description} slug={page?.slug || ''} />
      <Hero page={page} />
      <RenderBlocks blocks={page.layout} />
    </React.Fragment>
  )
}
