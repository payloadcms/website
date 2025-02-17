import type { Metadata } from 'next'

import { PayloadRedirects } from '@components/PayloadRedirects/index.js'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index.js'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import { fetchBlogPost, fetchPosts } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers.js'
import React from 'react'

import { Post } from '@components/Post/index.js'

export const dynamicParams = false

const getPost = async (slug, draft?) =>
  draft
    ? await fetchBlogPost(slug)
    : await unstable_cache(fetchBlogPost, ['blogPost', `post-${slug}`])(slug)

const PostPage = async ({
  params,
}: {
  params: Promise<{
    category: string
    slug: any
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { category, slug } = await params

  const blogPost = await getPost(slug, draft)

  const url = `/${category}/${slug}`

  if (!blogPost) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      <Post {...blogPost} />
    </>
  )
}

export default PostPage

export async function generateStaticParams() {
  const getPosts = unstable_cache(fetchPosts, ['allPosts'])
  const posts = await getPosts()

  return posts
    .map(({ slug, category }) => {
      if (!category || typeof category === 'string' || !category.slug) {
        return null
      }

      return {
        category: category.slug,
        slug,
      }
    })
    .filter(Boolean)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string
    slug: string
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { category, slug } = await params
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
      url: `/${category}/${slug}`,
    }),
    title: post?.meta?.title,
  }
}
