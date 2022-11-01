import React from 'react'
import { fetchBlogPosts } from '../../graphql'
import { RenderBlogArchive } from './renderBlogArchive'

const Page = async () => {
  const blogPosts = await fetchBlogPosts()
  return <RenderBlogArchive posts={blogPosts} />
}

export default Page
