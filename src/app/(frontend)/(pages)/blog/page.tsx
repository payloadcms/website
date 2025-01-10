import type { Metadata } from 'next'

import { fetchBlogPosts } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers.js'
import React from 'react'

import { RenderBlogArchive } from './renderBlogArchive.js'

const Page = async () => {
  const { isEnabled: draft } = await draftMode()
  const getBlogPosts = draft ? fetchBlogPosts : unstable_cache(fetchBlogPosts, ['blogPosts'])
  const blogPosts = await getBlogPosts()
  return <RenderBlogArchive posts={blogPosts} />
}

export default Page

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    url: '/blog',
  }),
}
