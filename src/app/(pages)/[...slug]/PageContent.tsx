'use client'

import React from 'react'

import Meta from '@components/Meta'
import { Page } from '@root/payload-types'
import { Hero } from '../../../components/Hero'
import { RenderBlocks } from '../../../components/RenderBlocks'

export const PageContent: React.FC<{
  page: Page
  slug: string
}> = ({ page, slug }) => {
  return (
    <React.Fragment>
      <Meta title={page.meta?.title} description={page.meta?.description} slug={slug} />
      <Hero page={page} />
      <RenderBlocks blocks={page.layout} />
    </React.Fragment>
  )
}
