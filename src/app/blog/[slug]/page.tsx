import React from 'react'
import { notFound } from 'next/navigation'
import { RenderBlogPost } from './render'
import { fetchBlogPost, fetchPosts } from '../../../graphql'

const Post = async ({ params }) => {
  const { slug } = params
  const blogPost = await fetchBlogPost(slug)

  if (!blogPost) return notFound()

  return <RenderBlogPost {...blogPost} />
}

export default Post

export async function generateStaticParams() {
  const posts = await fetchPosts()

  return posts.map(({ slug }) => ({
    slug,
  }))
}
