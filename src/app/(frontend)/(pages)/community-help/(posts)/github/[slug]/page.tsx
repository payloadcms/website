import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchCommunityHelp, fetchCommunityHelps } from '@data/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { slugToText } from '@root/utilities/slug-to-text.js'
import { Answer, Author, Comment, GithubDiscussionPage } from './client_page.js'

type DateFromSource = string

const isDiscussionData = (
  data: any,
): data is {
  id: string
  title?: string
  slug?: string
  discordID?: string
  githubID?: string
  communityHelpType?: 'discord' | 'github'
  communityHelpJSON: {
    title: string
    id: string
    author: Author
    answer?: Answer
    body: string
    createdAt: DateFromSource
    url: string
    commentTotal: number
    upvotes: number
    comments: Comment[]
    slug: string
  }
} => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'slug' in data &&
    'discordID' in data &&
    'githubID' in data &&
    'communityHelpType' in data &&
    'communityHelpJSON' in data
  )
}

const Discussion = async ({ params }) => {
  const { slug } = params

  const discussion = await fetchCommunityHelp(slug)
  if (!discussion || !discussion.helpful) return notFound()

  if (!isDiscussionData(discussion)) {
    throw new Error('Unexpected github discussion thread data')
  }

  return <GithubDiscussionPage {...discussion} />
}

export default Discussion

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_HELPS) return []

  try {
    const discussions = await fetchCommunityHelps('github')
    return discussions?.map(({ slug }) => ({ slug: slug || '404' })) ?? []
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const discussion = await fetchCommunityHelp(slug)
  return {
    title: slugToText(slug),
    openGraph: mergeOpenGraph({
      title: slugToText(slug),
      description: discussion?.introDescription ?? undefined,
      url: `/community-help/github/${slug}`,
    }),
  }
}
