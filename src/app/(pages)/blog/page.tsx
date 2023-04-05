import React from 'react'
import { Metadata } from 'next'

import { fetchBlogPosts } from '../../../graphql'
import { RenderBlogArchive } from './renderBlogArchive'

const Page = async () => {
  const blogPosts = await fetchBlogPosts()
  return <RenderBlogArchive posts={blogPosts} />
}

export default Page

export const metadata: Metadata = {
  openGraph: {
    url: '/blog',
  },
}
