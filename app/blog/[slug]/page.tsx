import React from 'react'
import { RenderBlogPost } from './render'
import { fetchBlogPost } from '../../../graphql'

const Page = async ({ params }) => {
  const { slug } = params
  const blogPost = await fetchBlogPost(slug)

  return <RenderBlogPost {...blogPost} />
}

export default Page
