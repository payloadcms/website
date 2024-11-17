import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchBlogPosts } from '@data'
import { RenderBlogArchive } from './renderBlogArchive.js'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers.js'

const Page = async () => {
  const { isEnabled: draft } = await draftMode()
  const getBlogPosts = draft ? fetchBlogPosts : unstable_cache(fetchBlogPosts, ['blogPosts'])
  const blogPosts = await getBlogPosts()

  console.log(blogPosts)

  if (!blogPosts.length) return <h3>No blog posts are published yet!</h3>

  return <RenderBlogArchive posts={blogPosts} />
}

export default Page

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    url: '/blog',
  }),
}
