import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { fetchBlogPosts } from '../../_graphql'
import { RenderBlogArchive } from './renderBlogArchive'

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
