import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchBlogPost, fetchPosts } from '@data'
import { BlogPost } from './BlogPost/index.js'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index.js'
import { PayloadRedirects } from '@components/PayloadRedirects/index.js'

const Post = async ({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}) => {
  const { slug } = await params

  const url = `/blog/${slug}`

  const { isEnabled: isDraftMode } = await draftMode()

  const blogPost = await fetchBlogPost(slug)

  if (!blogPost) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <BlogPost {...blogPost} />
    </>
  )
}

export default Post

export async function generateStaticParams() {
  const posts = await fetchPosts()

  return posts.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchBlogPost(slug)

  const ogImage =
    typeof page?.meta?.image === 'object' &&
    page?.meta?.image !== null &&
    'url' in page?.meta?.image &&
    `${process.env.NEXT_PUBLIC_CMS_URL}${page.meta.image.url}`

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      title: page?.meta?.title ?? undefined,
      url: `/blog/${slug}`,
      description: page?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}
