import React, { cache } from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchBlogPost, fetchPosts } from '@data'
import { BlogPost } from './BlogPost/index.js'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index.js'
import { PayloadRedirects } from '@components/PayloadRedirects/index.js'
import { draftMode } from 'next/headers.js'

const getPost = async (slug: string, draft = false) => {
  return draft ? await fetchBlogPost(slug, draft) : await cache(fetchBlogPost)(slug, draft)
}

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
      <BlogPost {...blogPost} />
    </>
  )
}

export default Post

export async function generateStaticParams() {
  const posts = await cache(fetchPosts)()

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
    title: post?.meta?.title,
    description: post?.meta?.description,
    openGraph: mergeOpenGraph({
      title: post?.meta?.title ?? undefined,
      url: `/blog/${slug}`,
      description: post?.meta?.description ?? undefined,
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
