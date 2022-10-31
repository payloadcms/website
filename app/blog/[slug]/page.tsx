import React from 'react'
import { RenderBlogPost } from './renderPage'
import { App } from '../../App'
import { fetchBlogPost } from '../../../graphql'

const Page = async ({ params }) => {
  const { slug } = params
  const blogPost = await fetchBlogPost(slug)

  return (
    <App>
      <RenderBlogPost {...blogPost} />
    </App>
  )
}

export default Page
