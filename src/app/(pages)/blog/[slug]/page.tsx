import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchBlogPost, fetchPosts } from '../../../../graphql'
import { RenderBlogPost } from './client_page'

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

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const page = await fetchBlogPost(slug)

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      url: `/blog/${slug}`,
      description: page?.meta?.description,
      images: [
        {
          url: typeof page.image === 'object' && page.image?.url ? page.image.url : '',
        },
      ],
    },
  }
}
