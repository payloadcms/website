import type { Metadata } from 'next'

import { PayloadRedirects } from '@components/PayloadRedirects/index.js'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index.js'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import { fetchBlogPost, fetchPosts } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers.js'
import React from 'react'

import { BlogPost } from './BlogPost/index.js'

const getPost = (slug, draft?) =>
  draft ? fetchBlogPost(slug) : unstable_cache(fetchBlogPost, ['blogPost', `post-${slug}`])(slug)

const Post = async ({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const blogPost = await getPost(slug, draft)

  const url = `/blog/${slug}`

  if (!blogPost) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      <BlogPost {...blogPost} />
    </>
  )
}

export default Post

export async function generateStaticParams() {
  const getPosts = unstable_cache(fetchPosts, ['blogPosts'])
  const posts = await getPosts()

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
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const post = await getPost(slug, draft)

  const ogImage =
    typeof post?.meta?.image === 'object' &&
    post?.meta?.image !== null &&
    'url' in post?.meta?.image &&
    `${process.env.NEXT_PUBLIC_CMS_URL}${post.meta.image.url}`

  return {
    description: post?.meta?.description,
    openGraph: mergeOpenGraph({
      description: post?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: post?.meta?.title ?? undefined,
      url: `/blog/${slug}`,
    }),
    title: post?.meta?.title,
  }
}
