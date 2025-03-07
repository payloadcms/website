import type { Metadata } from 'next'

import { fetchCommunityHelp, fetchCommunityHelps } from '@data/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { slugToText } from '@root/utilities/slug-to-text'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Answer, Author, Comment } from './client_page'

import { GithubDiscussionPage } from './client_page'

type DateFromSource = string

const isDiscussionData = (
  data: any,
): data is {
  communityHelpJSON: {
    answer?: Answer
    author: Author
    body: string
    comments: Comment[]
    commentTotal: number
    createdAt: DateFromSource
    id: string
    slug: string
    title: string
    upvotes: number
    url: string
  }
  communityHelpType?: 'discord' | 'github'
  discordID?: string
  githubID?: string
  id: string
  slug?: string
  title?: string
} => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'slug' in data &&
    'githubID' in data &&
    'communityHelpType' in data &&
    'communityHelpJSON' in data
  )
}

const getDiscussion = (slug, draft) =>
  draft
    ? fetchCommunityHelp(slug)
    : unstable_cache(fetchCommunityHelp, [`github-discussion-${slug}`])(slug)

const Discussion = async ({ params }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const discussion = await getDiscussion(slug, draft)
  if (!discussion || !discussion.helpful) {
    return notFound()
  }

  if (!isDiscussionData(discussion)) {
    throw new Error('Unexpected github discussion thread data')
  }

  return <GithubDiscussionPage {...discussion} />
}

export default Discussion

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_HELPS) {
    return []
  }

  try {
    const getGithubDiscussions = unstable_cache(fetchCommunityHelps, ['github-discussions'])
    const discussions = await getGithubDiscussions('github')
    return discussions?.map(({ slug }) => ({ slug: slug || '404' })) ?? []
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    return []
  }
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
  const discussion = await getDiscussion(slug, draft)
  return {
    openGraph: mergeOpenGraph({
      description: discussion?.introDescription ?? undefined,
      title: slugToText(slug),
      url: `/community-help/github/${slug}`,
    }),
    title: slugToText(slug),
  }
}
