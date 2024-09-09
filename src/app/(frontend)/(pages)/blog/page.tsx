import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchBlogPosts } from '@data'
import { RenderBlogArchive } from './renderBlogArchive.js'

const Page = async () => {
  const blogPosts = await fetchBlogPosts()
  return <RenderBlogArchive posts={blogPosts} />
}

export default Page

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    url: '/blog',
  }),
}
