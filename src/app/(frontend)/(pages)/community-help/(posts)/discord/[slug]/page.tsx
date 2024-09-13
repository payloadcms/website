import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchCommunityHelp, fetchCommunityHelps } from '@data/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { slugToText } from '@root/utilities/slug-to-text.js'
import { DiscordThreadPage, Messages } from './client_page.js'

const isThreadData = (
  data: any,
): data is {
  id: string
  title?: string
  slug?: string
  discordID?: string
  githubID?: string
  communityHelpType?: 'discord' | 'github'
  communityHelpJSON: {
    info: {
      name: string
      id: string
      guildId: string
      createdAt: string | number
    }
    intro: Messages
    messageCount: number
    messages: Messages[]
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
    'communityHelpType' in data &&
    'communityHelpJSON' in data
  )
}

const Thread = async ({ params }) => {
  const { slug } = params

  const thread = await fetchCommunityHelp(slug)

  // Algolia is return all threads as helpful, regardless of the value of the helpful field
  // So they are showing up in the archive at /community-help

  // This is a temporary fix to still show the page even if the thread is not marked as helpful

  // if (!thread || !thread.helpful) return notFound()
  if (!thread) return notFound()

  if (!isThreadData(thread)) {
    throw new Error('Unexpected thread data')
  }

  return <DiscordThreadPage {...thread} />
}

export default Thread

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_HELPS) return []

  try {
    const fetchedThreads = await fetchCommunityHelps('discord')
    return fetchedThreads?.map(({ slug }) => ({ slug: slug || '404' })) ?? []
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const thread = await fetchCommunityHelp(slug)
  return {
    title: slugToText(slug),
    openGraph: mergeOpenGraph({
      title: slugToText(slug),
      description: thread?.introDescription ?? undefined,
      url: `/community-help/discord/${slug}`,
    }),
  }
}
