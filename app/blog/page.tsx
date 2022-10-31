import React from 'react'
import { fetchBlogPosts } from '../../graphql'
import { App } from '../App'

import { RenderBlogArchive } from './renderBlogArchive'

const Page = async () => {
  const blogPosts = await fetchBlogPosts()

  return (
    <App>
      <RenderBlogArchive posts={blogPosts} />
    </App>
  )
}

export default Page
